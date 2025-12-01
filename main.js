import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client@2.0.0/dist/index.js";

const imageInputElem = document.getElementById('image');
const resultsElem = document.getElementById('results');
imageInputElem.addEventListener('input', readFileFromInput);

async function readFileFromInput() {
    const reader = new FileReader();
    const file = imageInputElem.files[0];
    reader.addEventListener('load', () => predict(reader, file.type))
    reader.readAsArrayBuffer(file); // ostatecznie chcemy blob, z ArrayBuffer łatwiej go utworzyć
}


async function predict(reader, imageMimeType) {
    const imageArrayBuffer = reader.result;
    const imageBlob = new Blob([imageArrayBuffer], { type: imageMimeType }); // gradio wymaga Blob
    const imageObjectURL = URL.createObjectURL(imageBlob); // do wyświetlenia obrazu w HTML

	const client = await Client.connect("kub43m/is-cat");
	const result = await client.predict("/predict", { img: imageBlob, });

    const label = result.data[0].label // tutaj etykieta z wyniku predykcji
    resultsElem.innerHTML = `<br/><img src="${imageObjectURL}" width="300"> <p>Classified as: ${label}</p>`
}
