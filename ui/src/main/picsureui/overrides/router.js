define(["backbone", "underscore", "handlebars", "studyAccess/studyAccess", "picSure/settings", "filter/filterList",
        "openPicsure/outputPanel", "picSure/queryBuilder", "text!openPicsure/searchHelpTooltipOpen.hbs", "overrides/outputPanel",
        "search-interface/filter-list-view", "search-interface/search-view", "search-interface/tool-suite-view",
        "search-interface/query-results-view", "api-interface/apiPanelView", "search-interface/filter-model",
        "search-interface/tag-filter-model", "landing/landing", "common/session"],
    function (BB, _, HBS, studyAccess, settings, filterList,
              outputPanel, queryBuilder, searchHelpTooltipTemplate, output,
              FilterListView, SearchView, ToolSuiteView, queryResultsView,
              ApiPanelView, filterModel, tagFilterModel, landingView, session) {
        let createUserSession = function (that, callback, args) {
            let uuid = localStorage.getItem('OPEN_ACCESS_UUID');
            if (uuid) {
                uuid = JSON.parse(uuid);
            }

            $.ajax({
                url: '/psama/open/authentication',
                type: 'POST',
                data: JSON.stringify({
                    UUID: uuid
                }),
                contentType: 'application/json',
                success: function (data) {
                    if (data.uuid) {
                        // we need to set the UUID cookie here, because the backend will not do it for us.
                        localStorage.setItem('OPEN_ACCESS_UUID', JSON.stringify(data.uuid));
                    }

                    session.sessionInit(data);
                    that.renderHeaderAndFooter();
                    if (callback) {
                        callback.apply(that, args);
                    }
                },
                error: function (data) {
                    // handle error
                    console.log(data);
                }
            });
        };

        let execute = function (callback, args, name) {
            let deferred = $.Deferred();
            if (!session.isValid(deferred)) {
                createUserSession(this, callback, args);
            } else {
                this.renderHeaderAndFooter();
                if (callback) {
                    callback.apply(this, args);
                }
            }
        };

        let displayLandingPage = function () {
            $(".header-btn.active").removeClass('active');
            $('#main-content').empty();
            let totalVars = filterModel.get("totalVariables");

            const landing = new landingView({totalVars: totalVars});
            $('#main-content').append(landing.$el);
            landing.render();
        };

        let displayDataAccess = function () {
            $(".header-btn.active").removeClass('active');
            $(".header-btn[data-href='/picsureui/dataAccess']").addClass('active');
            $('#main-content').empty();

            var studyAccessView = new studyAccess.View();
            $('#main-content').append(studyAccessView.$el);
            studyAccessView.render();
        };

        let displayOpenAccess = function () {
            sessionStorage.setItem("isOpenAccess", true);
            BB.pubSub.trigger('destroySearchView');

            $(".header-btn.active").removeClass('active');
            $(".header-btn[data-href='/picsureui/openAccess#']").addClass('active');
            $('#main-content').empty();
            $('#main-content').append(this.layoutTemplate(settings));
            let toolSuiteView = new ToolSuiteView({
                el:
                    $('#tool-suite-panel')
                , isOpenAccess: true
            });
            toolSuiteView.render();

            const outputPanelView = new outputPanel.View({toolSuiteView: toolSuiteView});
            const query = queryBuilder.generateQueryNew({}, {}, null, settings.openAccessResourceId);
            outputPanelView.render();
            $('#query-results').append(outputPanelView.$el);

            const parsedSess = JSON.parse(sessionStorage.getItem("session"));
            if (parsedSess.queryTemplate === undefined) {
                parsedSess.queryTemplate = "{}";
            }

            const searchView = new SearchView({
                queryTemplate: JSON.parse(parsedSess.queryTemplate),
                queryScopes: parsedSess.queryScopes,
                el: $('#filter-list')
            });

            if ($('#search-results-panel').is(":visible")) {
                $('#guide-me-button-container').hide();
            }

            const filterListView = new FilterListView({
                outputPanelView: outputPanelView,
                el: $('#filter-list-panel')
            });
            filterListView.render();
        };

        let displayAPI = function () {
            $(".header-btn.active").removeClass('active');
            $(".header-btn[data-href='/picsureui/api']").addClass('active');
            $('#main-content').empty();

            var apiPanelView = new ApiPanelView({});
            $('#main-content').append(apiPanelView.$el);
            apiPanelView.render();
        };

        return {
            routes: {
                /**
                 * Additional routes for the backbone router can be defined here. The field name should be the path,
                 * and the value should be a function.
                 *
                 * Ex:
                 * "picsureui/queryBuilder2" : function() { renderQueryBuilder2(); }
                 */
                "psamaui/login(/)": undefined,
                "picsureui/login(/)": undefined,
                "psamaui/logout(/)": undefined,
                "picsureui/dataAccess": displayDataAccess,
                "picsureui/openAccess": function () {
                    displayOpenAccess.call(this);
                },
                "picsureui/queryBuilder(/)": function () {
                    displayOpenAccess.call(this);
                },
                "picsureui/api": displayAPI,
                "picsureui(/)": displayLandingPage,
            },
            defaultAction: displayLandingPage,
            execute: function (callback, args, name) {
                execute.call(this, callback, args, name);
            }
        };
    }
);
