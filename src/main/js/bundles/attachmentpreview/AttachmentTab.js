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
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/_base/declare",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dojo/text!./templates/AttachmentTab.html"],
    function (dojo, d_array, d_lang, declare, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer, ContentPane, templateStringContent) {

        var AttachmentTab = declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin],

            {
                baseClass: "ctInfoContent ctGridContent",
                templateString: templateStringContent,
                widgetsInTemplate: true,
                context: null,
                content: null,
                contentFactory: null,
                showImagePreview: true,
                baseUrl: null,
                imageUrl: null,
                _started: false,

                uninitilize: function () {
                    this.inherited(arguments);
                },

                startup: function () {
                    var started = this._started;
                    this.inherited(arguments);
                    if (!started) {
                        this._init();
                    }
                },

                _init: function () {
                    this.imageUrl = this.contentFactory.imageUrl;

                    var layer = this.context.graphic.getLayer();
                    var url = layer.url;
                    var idProperty = layer.objectIdField;
                    var graphic = this.context.graphic;
                    var featureId = graphic.attributes[idProperty];
                    this.baseUrl = url + "/" + featureId + "/attachments/";

                    this._addAttachments();
                },

                _addAttachments: function () {
                    if (this.objectAttachments.length > 0) {
                        d_array.forEach(this.objectAttachments, function (attachment) {
                            if (attachment.contentType.indexOf('image') !== -1) {
                                this._addImageContainer(attachment);

                            } else if (attachment.contentType.indexOf('application/pdf') !== -1) {
                                this._addPdfPreviewContainer(attachment);

                            } else if (attachment.contentType.indexOf('officedocument.wordprocessingml.document') !== -1) {
                                this._addWordPreviewContainer(attachment);

                            } else {
                                this._addDefaultFileContainer(attachment);

                            }
                        }, this);
                    }
                },

                _addImageContainer: function (attachment) {
                    var imgUrl = this.showImagePreview ? this.baseUrl + attachment.id : this.imageUrl + "default_icon.png";
                    var image = "<a href=\"" + this.baseUrl + attachment.id + "\" target=\"_blank\"><image src=\"" + imgUrl + "\" width=\"50\" height=\"50\" alt=\"error\"></a>";
                    var filename = "<a href=\"" + this.baseUrl + attachment.id + "\" target=\"_blank\">" + attachment.name + "</a>";
                    var filesize = attachment.size + " Bytes";
                    var fileType = attachment.contentType;
                    var table = "<table><tr><td>" + image + "</td><td>" + filename + "<br>" + filesize + "<br>" + fileType + "</td></tr></table><hr>";
                    var contentPane = new ContentPane({
                        content: table,
                        style: "padding: 5px"
                    });
                    this.mainContainer.addChild(contentPane);
                },

                _addPdfPreviewContainer: function (attachment) {
                    var file = "<a href=\"" + this.baseUrl + attachment.id + "\" target=\"_blank\"><image src=\"" + this.imageUrl + "pdf_icon.png" + "\" width=\"50\" height=\"50\" alt=\"error\"></a>";
                    var filename = "<a href=\"" + this.baseUrl + attachment.id + "\" target=\"_blank\">" + attachment.name + "</a>";
                    var filesize = attachment.size + " Bytes";
                    var fileType = attachment.contentType;
                    var table = "<table><tr><td>" + file + "</td><td>" + filename + "<br>" + filesize + "<br>" + fileType + "</td></tr></table><hr>";
                    var contentPane = new ContentPane({
                        content: table,
                        style: "padding: 5px"
                    });
                    this.mainContainer.addChild(contentPane);
                },

                _addWordPreviewContainer: function (attachment) {
                    var file = "<a href=\"" + this.baseUrl + attachment.id + "\" target=\"_blank\"><image src=\"" + this.imageUrl + "word_icon.png" + "\" width=\"50\" height=\"50\" alt=\"error\"></a>";
                    var filename = "<a href=\"" + this.baseUrl + attachment.id + "\" target=\"_blank\">" + attachment.name + "</a>";
                    var filesize = attachment.size + " Bytes";
                    var fileType = attachment.contentType;
                    var table = "<table><tr><td>" + file + "</td><td>" + filename + "<br>" + filesize + "<br>" + fileType + "</td></tr></table><hr>";
                    var contentPane = new ContentPane({
                        content: table,
                        style: "padding: 5px"
                    });
                    this.mainContainer.addChild(contentPane);
                },

                _addDefaultFileContainer: function (attachment) {
                    var file = "<a href=\"" + this.baseUrl + attachment.id + "\" target=\"_blank\"><image src=\"" + this.imageUrl + "default_icon.png" + "\" width=\"50\" height=\"50\" alt=\"error\"></a>";
                    var filename = "<a href=\"" + this.baseUrl + attachment.id + "\" target=\"_blank\">" + attachment.name + "</a>";
                    var filesize = attachment.size + " Bytes";
                    var fileType = attachment.contentType;
                    var table = "<table><tr><td>" + file + "</td><td>" + filename + "<br>" + filesize + "<br>" + fileType + "</td></tr></table><hr>";
                    var contentPane = new ContentPane({
                        content: table,
                        style: "padding: 5px"
                    });
                    this.mainContainer.addChild(contentPane);
                },

                resize: function (dim) {
                    this.mainContainer.resize(dim);
                }

            });

        AttachmentTab.createWidget = function (params, contentFactory, attachments) {
            var widget = new AttachmentTab(d_lang.mixin(params, {
                contentFactory: contentFactory,
                objectAttachments: attachments
            }));
            return widget;
        };
        return AttachmentTab;
    });