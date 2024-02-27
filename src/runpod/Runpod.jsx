import { useState, useEffect } from 'react';

function Runpod() {
    const [podAPI, setPodAPI] = useState("");
    
    useEffect(() => {
        const fetchData = async () => {
            const url = 'https://api.runpod.io/graphql';
            const apiKey = import.meta.env.VITE_RUNPOD_KEY;

            const query = `
                query Pods {
                    myself {
                        pods {
                            id
                        }
                    }
                }
            `;

            const requestBody = {
                query: query
            };

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            };

            try {
                const response = await fetch(`${url}?api_key=${apiKey}`, requestOptions);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const responseData = await response.json();
                const ids = responseData.data.myself.pods.map(pod => pod.id);
                const newPodAPI = !ids.length ?  "No Running Pods": `https://${ids[0]}-8000.proxy.runpod.net/v1/chat/completions`;
                setPodAPI(newPodAPI);
            } catch (error) {
                setPodAPI("No Running Pods");
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return podAPI;
}

export default Runpod;
