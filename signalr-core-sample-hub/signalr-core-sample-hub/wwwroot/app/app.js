(async function () {
    let clientId = `CLIENT_${Math.round(Math.random() * 1000)}`;
    let counter = 0;

    console.log(`Test signalR Client started with clientId ${clientId}`);

    let connection = new signalR.HubConnectionBuilder().withUrl('/testHub').build();

    connection.on('MessageSentToOtherClients',
        (sender, message) => {
            console.info("MessageSentToOtherClients", sender, message);
        });

    await connection.start();

    setInterval(async () => {
        try {

            await connection.invoke('SendMessageToAllClients', clientId, `MSG_${++counter}`);

        } catch (err) {

            console.warn("SendMessageToAllClients", err);
        }

    },
        5000);
})();