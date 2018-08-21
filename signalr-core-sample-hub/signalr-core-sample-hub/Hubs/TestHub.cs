using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Hubs
{
    [Authorize]
    public class TestHub : Hub
    {
        public async Task SendMessageToAllClients(string sender, string message)
        {
            // await Task.Delay(TimeSpan.FromSeconds(1));

            await Clients.Others.SendAsync("MessageSentToOtherClients", sender, message);
        }
    }
}
