function uploadImage() {
    var input = document.getElementById('imageInput');
    var file = input.files[0];
    var reader = new FileReader();

    // 讀取圖片並顯示
    reader.onload = function (e) {
        var displayImage = document.getElementById('displayImage');
        displayImage.src = e.target.result;
    }
    reader.readAsDataURL(file);

    var formData = new FormData();
    formData.append("file", file);

    // 原始物件分類API
    fetch('https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/a4c344b8-78d4-41d4-a891-124c533c8cdf/classify/iterations/Iteration1/image', {
        method: 'POST',
        body: file,
        headers: {
            'Prediction-Key': 'f1c6314d48ef464b81eeb13f9342a2a9',
            'Content-Type': 'application/octet-stream'
        }
    })
    .then(response => response.json())
    .then(data => {
        var results = data.predictions.map(function(prediction) {
            return prediction.tagName + ': ' + (prediction.probability * 100).toFixed(2) + '%';
        }).join('<br>');
        document.getElementById('result').innerHTML = results;
    })
    .catch(error => console.error('Error:', error));


    reader.onload = async function (e) {
        var img = new Image();
        img.onload = async function () {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const response = await fetch('https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/c9f87440-fd3f-48ad-a3c4-7817177b679f/detect/iterations/Iteration1/image', {
                method: 'POST',
                body: file,
                headers: {
                    'Prediction-Key': 'b36c8f0a17814b72875d1965b139251e',
                    'Content-Type': 'application/octet-stream'
                }
            });

            const data = await response.json();
            if (data.predictions && data.predictions.length > 0) {
                data.predictions.forEach(function (prediction) {
                    const bbox = prediction.boundingBox;
                    const startX = bbox.left * img.width;
                    const startY = bbox.top * img.height;
                    const width = bbox.width * img.width;
                    const height = bbox.height * img.height;

                    ctx.beginPath();
                    ctx.rect(startX, startY, width, height);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'red';
                    ctx.stroke();

                    ctx.font = '16px Arial';
                    ctx.fillStyle = 'red';
                    ctx.fillText(prediction.tagName + ' (' + (prediction.probability * 100).toFixed(2) + '%)', startX, startY - 10);
                });
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}


