var CanvasDesigner = (function() {
    var iframe;
    var tools = {
        line: true,
        pencil: true,
        dragSingle: true,
        dragMultiple: true,
        eraser: true,
        rectangle: true,
        arc: true,
        bezier: true,
        quadratic: true,
        text: true
    };

    var selectedIcon = 'pencil';

    function syncData(data) {
        if (!iframe) return;

        iframe.contentWindow.postMessage({
            canvasDesignerSyncData: data
        }, '*');
    }

    var syncDataListener = function(data) {};
    
    function onMessage() {
        if (!event.data || !event.data.canvasDesignerSyncData) return;
        syncDataListener(event.data.canvasDesignerSyncData);
    }

    /*window.addEventListener('message', onMessage, false);*/

    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
        console.log('parent received message!:  ',e.data);
        if (!e.data || !e.data.canvasDesignerSyncData) return;
        syncDataListener(e.data.canvasDesignerSyncData);
    },false);


    return {
        appendTo: function(parentNode) {
            iframe = document.createElement('iframe');
            iframe.id="drawboard";
            iframe.src = 'widget.html?tools=' + JSON.stringify(tools) + '&selectedIcon=' + selectedIcon;
            iframe.style.width ="100%";
            iframe.style.height="100%";
            iframe.style.border = 0;
            parentNode.appendChild(iframe);
        },
        destroy: function() {
            if(iframe) {
                iframe.parentNode.removeChild(iframe);
            }
            window.removeEventListener('message', onMessage);
        },
        addSyncListener: function(callback) {
            syncDataListener = callback;
        },
        syncData: syncData,
        setTools: function(_tools) {
            tools = _tools;
        },
        setSelected: function(icon) {
            if (typeof tools[icon] !== 'undefined') {
                selectedIcon = icon;
            }
        }
    };
})();
