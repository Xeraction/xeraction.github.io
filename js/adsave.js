const prefix = "AntimatterDimensionsSavefileFormat";
const suffix = "EndOfSavefile";

let globalSave = undefined;

function decodeSave() {
    let save = document.getElementById("saveinput").value;
    if (!save.startsWith(prefix) || !save.endsWith(suffix)) {
        error("Invalid save file format!");
        return;
    }
    save = save.slice(prefix.length + 3, save.length - suffix.length);
    save = save.replace(/0b/gu, "+").replace(/0c/gu, "/").replace(/0a/gu, "0");
    save = atob(save);
    save = Uint8Array.from(Array.from(save).map(i => i.charCodeAt(0)));
    save = pako.inflate(save);
    save = new TextDecoder().decode(save);
    save = JSON.parse(save, (k, v) => ((v === Infinity) ? "Infinity" : v));
    globalSave = save;
    console.log(save);
}

function encodeSave() {
    if (globalSave === undefined)
        return;
    let save = globalSave;
    save = new TextEncoder().encode(save);
    save = pako.deflate(save);
    save = Array.from(save).map(i => String.fromCharCode(i)).join("");
    save = btoa(save);
    save = save.replace(/=+$/gu, "").replace(/0/gu, "0a").replace(/\+/gu, "0b").replace(/\//gu, "0c");
    save = `${prefix}AAB${save}${suffix}`;
    console.log(save);
}

function error(text) {
    document.getElementById("error").textContent = text;
}