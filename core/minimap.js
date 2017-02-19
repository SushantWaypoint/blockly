  <script>
                // Inject master workspace.
                var masterWorkspace = Blockly.inject('masterDiv',
                    {
                        media: '../../media/',
                        toolbox: document.getElementById('toolbox')
                    });
                // Inject slave workspace.
                var slaveWorkspace = Blockly.inject('slaveDiv',
                    {
                        media: '../../media/',
                        readOnly: true
                    });
                // Listen to events on master workspace.
                masterWorkspace.addChangeListener(mirrorEvent);

                function mirrorEvent(masterEvent) {
                    if (masterEvent.type == Blockly.Events.UI) {
                        return;  // Don't mirror UI events.
                    }
                    // Convert event to JSON.  This could then be transmitted across the net.
                    var json = masterEvent.toJson();
                    console.log(json);
                    // Convert JSON back into an event, then execute it.
                    var slaveEvent = Blockly.Events.fromJson(json, slaveWorkspace);
                    slaveEvent.run(true);
                }
            </script>