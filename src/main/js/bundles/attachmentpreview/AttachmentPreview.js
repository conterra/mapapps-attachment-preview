/*
 * Copyright (C) 2015 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(["dojo",
        "dojo/_base/lang",
        "dojo/_base/url",
        "dojo/_base/declare",
        "ct/request",
        "ct/_string",
        "ct/_when",
        "ct/_url",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/layout/BorderContainer",
        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dojo/text!./templates/AttachmentPreview.html",
        "contentviewer/GridContent",
        "./AttachmentTab"],
    function (dojo, d_lang, URL, declare, ct_request, ct_string, ct_when, ct_url, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer, TabContainer, ContentPane, templateStringContent, GridContent, AttachmentTab) {

        var AttachmentPreview = declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin],

            {
                baseClass: "ctInfoContent ctGridContent",

                templateString: templateStringContent,
                widgetsInTemplate: true,
                context: null,
                content: null,
                contentFactory: null,
                _started: false,

                uninitilize: function () {
                    this.inherited(arguments);
                },

                startup: function () {
                    var started = this._started;
                    this.inherited(arguments);
                    if (!started) {
                        this._init();
                        started = this._started = false;
                    }
                },

                _init: function () {

                    // check if grid or custom
                    if (this.rule.info.grid) {
                        var gridContentWidget = this._createGridContent();

                        var gridContentNode = new ContentPane({
                            title: "Attributes",
                            content: gridContentWidget
                        });

                        this.tabContainer.addChild(gridContentNode);

                    } else {
                        this._createCustomContent();
                    }

                    this._createAttachmentContent();
                },

                _createGridContent: function () {
                    var gridContent = GridContent.createWidget(this.params, this.contentFactory);
                    return gridContent;
                },

                _createAttachmentContent: function () {
                    // check layer for attachments
                    var layer = this.context.graphic.getLayer();

                    if (layer.hasAttachments) {

                        // check Object for attachments
                        var url = layer.url;
                        var graphic = this.context.graphic;
                        var objectID = graphic.attributes.objectid;
                        var object_url = url + "/" + objectID + "/attachments";

                        var json = ct_request({
                            url: object_url,
                            content: {
                                f: "pjson"
                            },
                            jsonp: "callback"
                        });

                        json.then(d_lang.hitch(this, function (result) {

                            // if there is at least one attachment -> add attachment-widget as child
                            if (result.attachmentInfos.length > 0) {

                                var attachmentWidget = AttachmentTab.createWidget(this.params, this.contentFactory, result.attachmentInfos);
                                var attachmentContentNode = new ContentPane({
                                    title: "Attachments",
                                    content: attachmentWidget
                                });

                                this.tabContainer.addChild(attachmentContentNode);
                            }
                        }), function (error) {
                            console.error("Error while loading attachments", error);
                        });
                    }
                },

                _createCustomContent: function () {
                    var info = this.params.rule.info;
                    var template = info.template || "";
                    var file = info.templateFile;

                    // check if TemplateString or TemplateFile
                    if (file) {
                        file = ct_url.resourceURL(file);
                        try {
                            template = dojo.cache(new URL(file), {
                                sanitize: true
                            });
                        } catch (e) {
                            template = "";
                            throw illegalArgumentError("CustomTemplateContent: Cannot load template " + file + "!", e);
                        }
                    }
                    var customContent = new ContentPane({
                        title: "Content",
                        content: this._replace(template),
                        style: "padding: 5px"
                    });
                    this.tabContainer.addChild(customContent);
                },

                _replace: function (input) {
                    var content = this.content;
                    var context = this.context;
                    return ct_when(this.dateAndDomainReplacer.replaceDomainValuesAndDates(content, context), function (content) {
                        var rule = this.rule || {};
                        var info = rule.info || {};
                        var valueNotFoundString = info.valueNotFoundString;
                        return ct_string.stringReplace(input, content, valueNotFoundString);
                    }, this);
                },

                resize: function (dim) {
                    this.mainContainer.resize(dim);
                }

            });

        AttachmentPreview.createWidget = function (params, contentFactory) {
            var widget = new AttachmentPreview(d_lang.mixin(params, {
                contentFactory: contentFactory,
                dateAndDomainReplacer: (contentFactory || {}).dateAndDomainReplacer
            }));
            return widget;
        };
        return AttachmentPreview;
    });