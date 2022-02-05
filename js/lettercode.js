let rawCode = '';
let jsonCode = [];
let vars = [];
let pars_cur_index = 0;

function runCode() {
    document.getElementById('error').innerText = '';
    document.getElementById('output').innerText = '';
    document.getElementById('output').innerText = 'Program output:\n';
    document.getElementById('run').style.display = 'none';
    document.getElementById('stop').style.display = 'inline';

    rawCode = document.getElementById('lcinput').value;
    jsonCode = [];
    vars = [];
    pars_cur_index = 0;

    if (rawCode === '') return;

    //parse the code (will make json)
    try {
        parseCode(0, rawCode.length + 1, true);
    } catch (err) {
        console.error(err);
    }
    console.log(jsonCode);

    //run the generated json (maybe make feature to export to json file but idk if it's worth it, what do you think?)
    try {
        executeCode(jsonCode);
    } catch (err) {
        console.error(err);
    }

    stopCode();
}

function stopCode() {
    document.getElementById('stop').style.display = 'none';
    document.getElementById('run').style.display = 'inline';
    throw new Error();
}

function executeCode(code) {
    for (let i = 0; i < code.length; i++) {
        const element = code[i];
        if (element.type === 'statement') {
            switch (element.key) {
                case 'end_program': {
                   stopCode();
                   break;
                }
                case 'print_to_screen': {
                    let toPrint = valueToString(element.value);
                    document.getElementById('output').innerText += toPrint + '\n';
                    break;
                }
                case 'var_init': {
                    let value = valueToString(element.value);
                    addVariable({"name": element.name, "value": value});
                    break;
                }
                case 'var_op': {
                    let value = valueToString(element.value);
                    let variable = getVariable(element.name);
                    if (element.mode === 'reassign') changeVariable(element.name, value);
                    else if (element.mode === 'add') {
                        let val = variable.value;
                        if (isString(val)) {
                            val = addTo(val, value, 'string', 'plus', true);
                        } else {
                            if (isString(value)) val = addTo(val, value, 'string', 'plus', true);
                            else val = addTo(val, value, 'double', 'plus', false);
                        }
                        changeVariable(element.name, val);
                    } else {
                        let op = '';
                        switch (element.mode) {
                            case 'subtract': op = 'minus'; break;
                            case 'multiply': op = 'times'; break;
                            case 'divide': op = 'divide'; break;
                        }
                        let val = variable.value;
                        if (isString(val)) error('Invalid operator before string.');
                        val = addTo(val, value, 'double', op, false);
                        changeVariable(element.name, val);
                    }
                    break;
                }
                default: error('Unknown operation statement.');
            }
        }
        else if (element.type === 'block') {
            if (element.key === 'if') {
                let exec = evaluateCondition(element.condition);
                if (exec) {
                    executeCode(element.code);
                }
            } else if (element.key === 'while') {
                let loops = 0;
                while (evaluateCondition(element.condition)) {
                    if (loops > 1000) error("Loop has more than 1000 iterations!");
                    executeCode(element.code);
                    loops++;
                }
            }
        }
    }
}

function parseCode(start, end, main) { //both inclusive
    const code = rawCode.substring(start, end + 1);
    let partCode = [];
    let partIndex = 0;
    if (main && !code.endsWith('x')) error('The program didn\'t end with an end statement.');
    for (let current = 0; current < code.length;) {
        console.log(code[current] + ' ' + (current + start));
        if (code[current] === 'x') {
            //end program
            let part = {"type": "statement", "key": "end_program"};
            if (main) {
                jsonCode[pars_cur_index++] = part;
                return;
            } else {
                partCode[partIndex++] = part;
                current++;
            }
        }
        if (code[current] === 'z') {
            if (main) error("Cannot close code body on the main level.");
            else return partCode;
        }
        if (code[current] === 'v') {
            //variable initialization
            let varName = getVarName(++current + start).toLowerCase();
            if (varName === '') error('Invalid variable name.');
            current += varName.length;
            if (code[current++] === 'e') {
                let value = makeValue(current + start);
                let part = {"type": "statement", "key": "var_init", "name": varName, "value": value};
                if (main) jsonCode[pars_cur_index++] = part;
                else partCode[partIndex++] = part;
                for (let i = 0; i < value.length; i++) {
                    current += value[i].length;
                }
                checkL(current++ + start);
                continue;
            } else error('Variable initialization must use the \'=\' (e) operator.');
        }
        if (code[current] === code[current].toUpperCase()) {
            //variable operation
            let varName = getVarName(current + start).toLowerCase();
            if (varName === '') error('Invalid variable name.');
            current += varName.length;
            let value;
            if (code[current] === 'e') {
                value = makeValue(++current + start);
                let part = {"type": "statement", "key": "var_op", "mode": "reassign", "name": varName, "value": value};
                if (main) jsonCode[pars_cur_index++] = part;
                else partCode[partIndex++] = part;
            } else {
                let mode = '';
                switch (code[current]) {
                    case 'p': mode = 'add'; break;
                    case 'm': mode = 'subtract'; break;
                    case 'n': mode = 'multiply'; break;
                    case 'q': mode = 'divide'; break;
                    default: error('Operator at variable must be an assignment operator.');
                }
                if (code[++current] === 'e') {
                    value = makeValue(++current + start);
                    let part = {"type": "statement", "key": "var_op", "mode": mode, "name": varName, "value": value};
                    if (main) jsonCode[pars_cur_index++] = part;
                    else partCode[partIndex++] = part;
                } else error('Operator at variable must be an assignment operator.');
            }
            for (let i = 0; i < value.length; i++) {
                current += value[i].length;
            }
            checkL(current++ + start);
            continue;
        }
        if (code[current] === 'h') {
            //print to screen
            let output = makeValue(++current + start);
            let part = {"type": "statement", "key": "print_to_screen", "value": output};
            if (main) jsonCode[pars_cur_index++] = part;
            else partCode[partIndex++] = part;
            for (let i = 0; i < output.length; i++) {
                current += output[i].length;
            }
            checkL(current++ + start);
            continue;
        }
        if (code[current] === 'j') {
            //if statement
            let cond = getCondition(++current + start);
            current += getValueLength(cond.value_1) + getValueLength(cond.value_2) + 2;
            let closingPos = getClosingPos(current + start);
            let inCode = parseCode(current + 1 + start, closingPos + 1, false);
            let part = {"type": "block", "key": "if", "condition": cond, "code": inCode};
            if (main) jsonCode[pars_cur_index++] = part;
            else partCode[partIndex++] = part;
            current = closingPos - start + 1;
            console.log(current);
            continue;
        }
        if (code[current] === 'r') {
            //while statement
            let cond = getCondition(++current + start);
            current += getValueLength(cond.value_1) + getValueLength(cond.value_2) + 2;
            let closingPos = getClosingPos(current + start);
            let inCode = parseCode(current + 1 + start, closingPos + 1, false);
            let part = {"type": "block", "key": "while", "condition": cond, "code": inCode};
            if (main) jsonCode[pars_cur_index++] = part;
            else partCode[partIndex++] = part;
            current = closingPos - start + 1;
            continue;
        }
        else error("Unknown statement.");
    }
    if (!main) error("Unclosed body.");
}

//variable functions
function addVariable(variable) {
    vars[vars.length] = variable;
}

function getVariable(name) {
    for (let i = 0; i < vars.length; i++) {
        if (vars[i].name === name) {
            return vars[i];
        }
    }
    error('Unknown variable.');
}

function changeVariable(name, value) {
    let i = vars.indexOf(getVariable(name));
    vars[i].value = value;
}

//executing utility functions
function valueToString(value) {
    let string = '';
    let isString = false;
    let nextOperator = '';
    for (let i = 0; i < value.length; i++) {
        switch (value[i].type) {
            case 'operator': {
                nextOperator = value[i].key;
                break;
            }
            case 'variable': {
                let val = getVariable(value[i].name);
                if (this.isString(val.value)) string = addTo(string, val.value, 'string', nextOperator, true);
                else string = addTo(string, val.value, 'double', nextOperator, false);
                break;
            }
            case 'character':
            case 'string': isString = true;
            case 'integer':
            case 'double':
            case 'boolean': {
                string = addTo(string, value[i].value.toString(), value[i].type, nextOperator, isString);
                break;
            }
            case 'user_input': {
                isString = true;
                string = addTo(string, requestUserInput(), 'string', nextOperator, isString);
                break;
            }
            default: error('Invalid value type.');
        }
    }
    return string;
}

function addTo(string, adder, type, op, isString) {
    if (type === 'string' || type === 'character') {
        if (op === 'plus' || op === '') {
            return string + adder;
        }
        error('Invalid operator before string.');
    }
    if (type === 'integer' || type === 'double') {
        if (isString) return addTo(string, adder, 'string', op, true);
        let num = parseFloat(string);
        if (isNaN(num)) num = 0;
        let add = parseFloat(adder);
        if (op === 'plus' || op === '') num += add;
        if (op === 'minus') num -= add;
        if (op === 'times') num *= add;
        if (op === 'divide') num /= add;
        return num.toString();
    }
    if (type === 'boolean') {
        if (isString) return addTo(string, adder, 'string', op, true);
        let num = parseFloat(string);
        if (isNaN(num)) num = 0;
        let add = (adder === 'true' ? 1 : 0);
        if (op === 'plus' || op === '') num += add;
        if (op === 'minus') num -= add;
        if (op === 'times') num *= add;
        if (op === 'divide') num /= add;
        return num.toString();
    }
    error('Invalid variable type.');
}

function requestUserInput() {
    return window.prompt('User input:');
}

function isString(value) {
    return isNaN(value);
}

function evaluateCondition(condition) {
    let val1 = valueToString(condition.value_1);
    let val2 = valueToString(condition.value_2);
    if (condition.operator === 'equal_to') {
        return condition.value_1.type === condition.value_2.type && val1 === val2;
    }
    if (condition.value_1.type === 'string' || condition.value_1.type === 'character' || condition.value_2.type === 'string' || condition.value_2.type === 'character') return false;
    if (val1 === 'true') val1 = 1;
    else if (val1 === 'false') val1 = 0;
    else val1 = parseFloat(val1);
    if (val2 === 'true') val2 = 1;
    else if (val2 === 'false') val2 = 0;
    else val2 = parseFloat(val2);
    if (condition.operator === 'greater_than') return val1 > val2;
    if (condition.operator === 'less_than') return val1 < val2;
    error('Unknown conditional operator.');
}

//parsing utility functions
function makeValue(pos) {
    let val = [];
    let valPos = 1;
    val[0] = getValue(pos);
    pos += val[0].length;
    for (; pos < rawCode.length; valPos++) {
        let tmpVal = getValue(pos);
        if (tmpVal === undefined) break;
        val[valPos] = tmpVal;
        pos += val[valPos].length;
    }
    return val;
}

function getValue(pos) {
    if (rawCode[pos] === rawCode[pos].toUpperCase()) {
        //variable
        let varName = getVarName(pos).toLowerCase();
        return {"type": "variable", "name": varName, "length": varName.length};
    }
    if (rawCode[pos] === 's') {
        //string value
        let st = getBetweenCharacters(pos, 's');
        let s = st;
        for (let i = 0; i < s.length; i++) {
            if (s[i] === 'g') {
                switch (s[i + 1]) {
                    case 'g': s = s.removeCharAt(i); break;
                    case 's': s = s.removeCharAt(i); break;
                    case 'l': s = s.removeCharAt(i); s = s.replaceCharAt(' ', i); break;
                    case 'n': s = s.removeCharAt(i); s = s.replaceCharAt('\n', i); break;
                    default: error('Invalid escape character.'); break;
                }
            }
        }
        return {"type": "string", "value": s, "length": st.length + 2};
    }
    if (rawCode[pos] === 'c') {
        //character value
        let ch = getBetweenCharacters(pos, 'c');
        let c = ch;
        if (c.length === 2) {
            if (c[0] === 'g') {
                switch (c[1]) {
                    case 'g': c = 'g'; break;
                    case 'c': c = 'c'; break;
                    case 'l': c = ' '; break;
                    case 'n': c = '\n'; break;
                }
            }
        }
        if (c.length > 1) error('Character values can only have one character.');
        return {"type": "character", "value": c, "length": ch.length + 2};
    }
    if (rawCode[pos] === 'i') {
        //integer value
        let i = getBetweenCharacters(pos, 'i');
        let int = parseInt(i);
        return {"type": "integer", "value": int, "length": i.length + 2};
    }
    if (rawCode[pos] === 'd') {
        //double value
        let d = getBetweenCharacters(pos, 'd');
        let double = parseFloat(d);
        return {"type": "double", "value": double, "length": d.length + 2};
    }
    if (rawCode[pos] === 'b') {
        //boolean value
        let b = getBetweenCharacters(pos, 'b');
        switch (b) {
            case 'true':
            case '1':
                return {"type": "boolean", "value": true, "length": b.length + 2};
            case 'false':
            case '0':
                return {"type": "boolean", "value": false, "length": b.length + 2};
            default: error('Invalid boolean value.');
        }
    }
    if (rawCode[pos] === 'u') {
        //user input
        return {"type": "user_input", "length": 1};
    }
    if (rawCode[pos] === 'p') {
        //plus
        return {"type": "operator", "key": "plus", "length": 1};
    }
    if (rawCode[pos] === 'm') {
        //minus
        return {"type": "operator", "key": "minus", "length": 1};
    }
    if (rawCode[pos] === 'n') {
        //times
        return {"type": "operator", "key": "times", "length": 1};
    }
    if (rawCode[pos] === 'q') {
        //divide
        return {"type": "operator", "key": "divide", "length": 1};
    }
    return undefined;
}

function getVarName(pos) {
    let name = '';
    for (let i = pos; i < rawCode.length; i++) {
        if (rawCode[i] === rawCode[i].toUpperCase()) name += rawCode[i];
        else break;
    }
    return name;
}

function error(msg) {
    document.getElementById('error').innerText = 'Error: ' + msg;
    throw new Error();
}

function checkL(pos) {
    if (rawCode[pos] !== 'l') error('Missing statement ending. (position ' + pos + ')');
}

function getBetweenCharacters(pos, char) {
    if (rawCode[pos] !== char) return undefined;

    let end = pos + 1;
    for (let i = end; i < rawCode.length; i++) {
        if (rawCode[i] === char) {
            if (rawCode[i - 1] === 'g' && rawCode[i - 2] !== 'g') continue;
            end = i;
            break;
        }
    }

    return rawCode.substring(pos + 1, end);
}

function getCondition(pos) {
    let val1 = makeValue(pos);
    let val2;
    let condOp = '';
    pos += getValueLength(val1);
    if (rawCode[pos] === 'g' && rawCode[pos + 1] === 't') condOp = 'greater_than';
    else if (rawCode[pos] === 'l' && rawCode[pos + 1] === 't') condOp = 'less_than';
    else if (rawCode[pos] === 'e' && rawCode[pos + 1] === 't') condOp = 'equal_to';
    else error("Unknown conditional operator.");
    pos += 2;
    val2 = makeValue(pos);
    return {"value_1": val1, "value_2": val2, "operator": condOp};
}

function getValueLength(value) {
    let length = 0;
    for (let i = 0; i < value.length; i++) {
        length += value[i].length;
    }
    return length;
}

function getClosingPos(pos) {
    let inString = false;
    let bodyIndex = 0;
    for (let i = pos + 1; i < rawCode.length; i++) {
        if ((rawCode[i] === 's') && (rawCode[i - 1] !== 'g' || (rawCode[i - 1] === 'g' && rawCode[i - 2] === 'g'))) {
            inString = !inString;
        }
        if (rawCode[i] === 't' && rawCode[i - 1] !== 'g' && rawCode[i - 1] !== 'l' && rawCode[i - 1] !== 'e' && rawCode[i + 1] !== 'c') {
            if (!inString) {
                bodyIndex++;
            }
        }
        if (rawCode[i] === 'z' && rawCode[i - 1] !== 'c') {
            if (!inString) {
                if (bodyIndex === 0) return i;
                bodyIndex--;
            }
        }
    }
}

//easy functions to edit strings
String.prototype.removeCharAt = function(i) {
    let tmp = this.split('');
    tmp.splice(i, 1);
    return tmp.join('');
}

String.prototype.replaceCharAt = function(c, i) {
    let tmp = this.split('');
    tmp[i] = c;
    return tmp.join('');
}