document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('chat-input').value;
    if (input) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: input })
        });
        const data = await response.json();
        document.getElementById('chat-history').innerHTML += `<div>You: ${input}</div>`;
        document.getElementById('chat-history').innerHTML += `<div>Bot: ${data.reply}</div>`;
    }
});

document.getElementById('file-upload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        alert(`File uploaded: ${data.fileName}`);
    }
});

document.getElementById('record-btn').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    let audioChunks = [];
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
        const response = await fetch('/api/process-audio', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        document.getElementById('chat-history').innerHTML += `<div>Bot: ${data.reply}</div>`;
    };
    setTimeout(() => {
        mediaRecorder.stop();
    }, 5000); // Record for 5 seconds
});