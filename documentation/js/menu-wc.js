'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">chinese-flashcards documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-fc5e75fde2f02cb50296d4c91377e8aeb089fcaa22146d4113df9b4f23ceec69555b820b3c8ae668ec1b2d5477a6c58c9c4b2282bad893489af56fae5fa36c29"' : 'data-bs-target="#xs-components-links-module-AppModule-fc5e75fde2f02cb50296d4c91377e8aeb089fcaa22146d4113df9b4f23ceec69555b820b3c8ae668ec1b2d5477a6c58c9c4b2282bad893489af56fae5fa36c29"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-fc5e75fde2f02cb50296d4c91377e8aeb089fcaa22146d4113df9b4f23ceec69555b820b3c8ae668ec1b2d5477a6c58c9c4b2282bad893489af56fae5fa36c29"' :
                                            'id="xs-components-links-module-AppModule-fc5e75fde2f02cb50296d4c91377e8aeb089fcaa22146d4113df9b4f23ceec69555b820b3c8ae668ec1b2d5477a6c58c9c4b2282bad893489af56fae5fa36c29"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CollectionPageModule.html" data-type="entity-link" >CollectionPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-CollectionPageModule-45279a1d63e5db7ef98b7f49aab2f12dbda15893e9c7c918c62b7a677c8b9d05b1db8ba7dfb545e0a1319367269486c64deaa0d6af677e14c82d7180cadc1d36"' : 'data-bs-target="#xs-components-links-module-CollectionPageModule-45279a1d63e5db7ef98b7f49aab2f12dbda15893e9c7c918c62b7a677c8b9d05b1db8ba7dfb545e0a1319367269486c64deaa0d6af677e14c82d7180cadc1d36"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CollectionPageModule-45279a1d63e5db7ef98b7f49aab2f12dbda15893e9c7c918c62b7a677c8b9d05b1db8ba7dfb545e0a1319367269486c64deaa0d6af677e14c82d7180cadc1d36"' :
                                            'id="xs-components-links-module-CollectionPageModule-45279a1d63e5db7ef98b7f49aab2f12dbda15893e9c7c918c62b7a677c8b9d05b1db8ba7dfb545e0a1319367269486c64deaa0d6af677e14c82d7180cadc1d36"' }>
                                            <li class="link">
                                                <a href="components/CardEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CardProgressBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardProgressBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CardViewerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionCardsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionCardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CollectionListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-CollectionPageModule-45279a1d63e5db7ef98b7f49aab2f12dbda15893e9c7c918c62b7a677c8b9d05b1db8ba7dfb545e0a1319367269486c64deaa0d6af677e14c82d7180cadc1d36"' : 'data-bs-target="#xs-pipes-links-module-CollectionPageModule-45279a1d63e5db7ef98b7f49aab2f12dbda15893e9c7c918c62b7a677c8b9d05b1db8ba7dfb545e0a1319367269486c64deaa0d6af677e14c82d7180cadc1d36"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-CollectionPageModule-45279a1d63e5db7ef98b7f49aab2f12dbda15893e9c7c918c62b7a677c8b9d05b1db8ba7dfb545e0a1319367269486c64deaa0d6af677e14c82d7180cadc1d36"' :
                                            'id="xs-pipes-links-module-CollectionPageModule-45279a1d63e5db7ef98b7f49aab2f12dbda15893e9c7c918c62b7a677c8b9d05b1db8ba7dfb545e0a1319367269486c64deaa0d6af677e14c82d7180cadc1d36"' }>
                                            <li class="link">
                                                <a href="pipes/CardMeaningsPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardMeaningsPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/JoinPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JoinPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LearnPageModule.html" data-type="entity-link" >LearnPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LearnPageModule-ba99d6f470ce327427aefd68145f934a52f423ea0ea7fd26c0d76aed56b3648ce9eb403e540c68df96de00ec09fbbe7b06e7dbe17f9e7e4807e8f44e747d8015"' : 'data-bs-target="#xs-components-links-module-LearnPageModule-ba99d6f470ce327427aefd68145f934a52f423ea0ea7fd26c0d76aed56b3648ce9eb403e540c68df96de00ec09fbbe7b06e7dbe17f9e7e4807e8f44e747d8015"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LearnPageModule-ba99d6f470ce327427aefd68145f934a52f423ea0ea7fd26c0d76aed56b3648ce9eb403e540c68df96de00ec09fbbe7b06e7dbe17f9e7e4807e8f44e747d8015"' :
                                            'id="xs-components-links-module-LearnPageModule-ba99d6f470ce327427aefd68145f934a52f423ea0ea7fd26c0d76aed56b3648ce9eb403e540c68df96de00ec09fbbe7b06e7dbe17f9e7e4807e8f44e747d8015"' }>
                                            <li class="link">
                                                <a href="components/SessionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SessionFillingStepComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionFillingStepComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SessionLauncherComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionLauncherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SessionMatchingStepComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionMatchingStepComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-LearnPageModule-ba99d6f470ce327427aefd68145f934a52f423ea0ea7fd26c0d76aed56b3648ce9eb403e540c68df96de00ec09fbbe7b06e7dbe17f9e7e4807e8f44e747d8015"' : 'data-bs-target="#xs-pipes-links-module-LearnPageModule-ba99d6f470ce327427aefd68145f934a52f423ea0ea7fd26c0d76aed56b3648ce9eb403e540c68df96de00ec09fbbe7b06e7dbe17f9e7e4807e8f44e747d8015"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-LearnPageModule-ba99d6f470ce327427aefd68145f934a52f423ea0ea7fd26c0d76aed56b3648ce9eb403e540c68df96de00ec09fbbe7b06e7dbe17f9e7e4807e8f44e747d8015"' :
                                            'id="xs-pipes-links-module-LearnPageModule-ba99d6f470ce327427aefd68145f934a52f423ea0ea7fd26c0d76aed56b3648ce9eb403e540c68df96de00ec09fbbe7b06e7dbe17f9e7e4807e8f44e747d8015"' }>
                                            <li class="link">
                                                <a href="pipes/CardMeaningsPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardMeaningsPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsModule.html" data-type="entity-link" >SettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SettingsModule-f8fae54e1e583404f8f74e8e7bdbb2fbed457efacd7117c3e37130fa2797d99344a80c121a78af306c1ebcd7248a236aaac3ab709b0e4aba3aec4ffe1bb95fe1"' : 'data-bs-target="#xs-components-links-module-SettingsModule-f8fae54e1e583404f8f74e8e7bdbb2fbed457efacd7117c3e37130fa2797d99344a80c121a78af306c1ebcd7248a236aaac3ab709b0e4aba3aec4ffe1bb95fe1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SettingsModule-f8fae54e1e583404f8f74e8e7bdbb2fbed457efacd7117c3e37130fa2797d99344a80c121a78af306c1ebcd7248a236aaac3ab709b0e4aba3aec4ffe1bb95fe1"' :
                                            'id="xs-components-links-module-SettingsModule-f8fae54e1e583404f8f74e8e7bdbb2fbed457efacd7117c3e37130fa2797d99344a80c121a78af306c1ebcd7248a236aaac3ab709b0e4aba3aec4ffe1bb95fe1"' }>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ButtonComponent.html" data-type="entity-link" >ButtonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CardComponent.html" data-type="entity-link" >CardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CardDifficultyComponent.html" data-type="entity-link" >CardDifficultyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CardProgressIndicatorComponent.html" data-type="entity-link" >CardProgressIndicatorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmDialogComponent.html" data-type="entity-link" >ConfirmDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InlineConfirmDialogComponent.html" data-type="entity-link" >InlineConfirmDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PinyinFormFieldComponent.html" data-type="entity-link" >PinyinFormFieldComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidenavComponent.html" data-type="entity-link" >SidenavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SlideToggleComponent.html" data-type="entity-link" >SlideToggleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TabBarComponent.html" data-type="entity-link" >TabBarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VirtualKeyboardComponent.html" data-type="entity-link" >VirtualKeyboardComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/LongPressDirective.html" data-type="entity-link" >LongPressDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Card.html" data-type="entity-link" >Card</a>
                            </li>
                            <li class="link">
                                <a href="classes/CardCollection.html" data-type="entity-link" >CardCollection</a>
                            </li>
                            <li class="link">
                                <a href="classes/CoercionComponent.html" data-type="entity-link" >CoercionComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ControlValueAccessorComponent.html" data-type="entity-link" >ControlValueAccessorComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/Database.html" data-type="entity-link" >Database</a>
                            </li>
                            <li class="link">
                                <a href="classes/SessionCard.html" data-type="entity-link" >SessionCard</a>
                            </li>
                            <li class="link">
                                <a href="classes/Settings.html" data-type="entity-link" >Settings</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CardService.html" data-type="entity-link" >CardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CollectionService.html" data-type="entity-link" >CollectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatabaseService.html" data-type="entity-link" >DatabaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LearningSessionService.html" data-type="entity-link" >LearningSessionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingsService.html" data-type="entity-link" >SettingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatisticsService.html" data-type="entity-link" >StatisticsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TabBarService.html" data-type="entity-link" >TabBarService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CardCollectionModel.html" data-type="entity-link" >CardCollectionModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CardForm.html" data-type="entity-link" >CardForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CardModel.html" data-type="entity-link" >CardModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollectionForm.html" data-type="entity-link" >CollectionForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CollectionStats.html" data-type="entity-link" >CollectionStats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfirmDialogConfig.html" data-type="entity-link" >ConfirmDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MatchingCard.html" data-type="entity-link" >MatchingCard</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PendingChangesComponent.html" data-type="entity-link" >PendingChangesComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingsForm.html" data-type="entity-link" >SettingsForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingsModel.html" data-type="entity-link" >SettingsModel</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/CardMeaningsPipe.html" data-type="entity-link" >CardMeaningsPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/JoinPipe.html" data-type="entity-link" >JoinPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});