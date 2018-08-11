using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Singletons
{
    public class SingletonServiceOne
    {
        private readonly IHubContext<TestHub> _testHubContext;

        private Timer _timer;

        public SingletonServiceOne()
        {
        }

        public SingletonServiceOne(IHubContext<TestHub> testHubContext)
        {
            _testHubContext = testHubContext;
        }

        public void Start()
        {
            _timer = new Timer(onTimer, null, 1000, 10000);
        }

        private void onTimer(object state)
        {
            _testHubContext.Clients.All.SendAsync("MessageSentToOtherClients", this.GetType().Name, $"Messaggio server delle {DateTime.Now.ToLongTimeString()}");
        }
    }
}
