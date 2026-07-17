const FAL_KEY = "b4a014f9-a51c-48a3-89bb-2c8bc939f659:7d1f82cc66411dac340a83ca18b0092e";

// ვაკავშირებთ Fal კლიენტს შენს API გასაღებთან
fal.config({
    credentials: FAL_KEY
});

document.getElementById('generateBtn').addEventListener('click', async () => {
    const dreamText = document.getElementById('dreamInput').value.trim();
    
    if (!dreamText) {
        alert('გთხოვთ, ჯერ ჩაწეროთ თქვენი სიზმარი!');
        return;
    }

    const loadingDiv = document.getElementById('loading');
    const loadingText = document.getElementById('loadingText');
    const videoContainer = document.getElementById('videoContainer');
    const dreamVideo = document.getElementById('dreamVideo');

    // ეკრანის მომზადება (ინტერფეისის შეცვლა)
    loadingDiv.classList.remove('hidden');
    videoContainer.classList.add('hidden');
    loadingText.innerText = "კავშირი მყარდება AI სერვერთან...";

    try {
        // ვიყენებთ Luma Dream Machine მოდელს ოფიციალური ბიბლიოთეკით
        const result = await fal.subscribe("fal-ai/luma-dream-machine", {
            input: {
                prompt: dreamText,
                aspect_ratio: "16:9"
            },
            // ეს ფუნქცია მუშაობს მაშინვე, როცა ვიდეო რიგში დგება და იწყებს მზადებას
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    loadingText.innerText = "ვიდეო გენერირდება... გთხოვთ დაელოდოთ (ჩვეულებრივ სჭირდება 30-60 წამი)";
                } else if (update.status === "IN_QUEUE") {
                    loadingText.innerText = "თქვენი მოთხოვნა რიგშია, მალე დაიწყება...";
                }
            }
        });

        // როცა გენერაცია მორჩება, ლინკს ვიღებთ პირდაპირ ობიექტიდან
        if (result && result.video && result.video.url) {
            dreamVideo.src = result.video.url; 
            dreamVideo.load();

            // ვმალავთ ლოადერს და ვაჩენთ ვიდეოს
            loadingDiv.classList.add('hidden');
            videoContainer.classList.remove('hidden');
        } else {
            throw new Error("ვიდეოს ლინკი ვერ მოიძებნა პასუხში");
        }

    } catch (error) {
        console.error('დეტალური შეცდომა:', error);
        alert('ვიდეოს შექმნისას მოხდა შეცდომა. დარწმუნდით, რომ ინტერნეტი სტაბილურია და API გასაღებზე გაქვთ ბალანსი.');
        loadingDiv.classList.add('hidden');
    }
});
