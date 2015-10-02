# Attachment Preview
The attachment preview bundle enables the user to access a feature's attributes and attachments in a single info window. Attachments are displayed by a preview of the image or a document icon. Therefore this bundles adds an additional tab to the info window if the feature contains attachments. If there are no attachments available, the tab will not be displayed at all for this feature. 

The bundle uses the ContentRule interface of the contentviewer bundle and provides a very similar configuration. The first tab is still configurable and able to display the feature's attributes in a grid or custom layout.

### Sample App ###
http://www.mapapps.de/mapapps/resources/apps/downloads_tabcontent/index.html

Anleitung (DE)
--------------
Das Attachment-Preview-Bundle nutzt den bereits vorhandenen contentviewer und lässt sich auch über diesen Konfigurieren. Die Beispielkonfiguration der Sample App zeigt den Aufbau des contentviewer für die Nutzung der Attachment Preview:
```
"contentviewer": {
      "ContentRegistration": {
        "contentRules": [
          {
            "info": {
              "grid": true,
              "valueNotFoundString": "",
              "title": "{titel}",
              "showDetailsButton": false,
              "skipProperties": [
                "geometry"
              ],
              "template": "Typ: {typ}<br />Potenzial: {potenzial}<br /><br />{beschreibung}<br /><br />Erfasst von: {erfasser}<br />Datum: {datum}"
            },
            "matches": {
              "context": {
                "mapModelNodeId": "brachflaechen/0"
              }
            },
            "windowSize": {
              "w": 320,
              "h": 300
            },
            "type": "AttachmentPreview"
          }
        ]
      },
      "enabled": true
    },
```

In diesem Fall wurde für den ersten Tab die Grid-Darstellung für die Attribute der Features gewählt. Wird stattdessen der Wert ```grid: false``` gesetzt, so greift das definierte custom template (```template```).
