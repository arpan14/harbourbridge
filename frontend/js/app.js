// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import "./pages/MainScreen/MainScreen.page.js";
import "./pages/SchemaConversionScreen/SchemaConversionScreen.page.js";
import "./pages/Instructions/Instructions.page.js";
import "./pages/DefaultLayout/DefaultLayout.page.js";
import {setActiveSelectedMenu} from './helpers/SchemaConversionHelper.js'
import Actions from "./services/Action.service.js";
// Home screen component
const HomeComponent = {

  render: () => {
    document.getElementById(
      "app"
    ).innerHTML = `<hb-default-layout><hb-main-screen></hb-main-screen></hb-default-layout>`;
  },
};

// Edit Schema screen component
const SchemaComponent = {
  render: () => {
    document.getElementById(
      "app"
    ).innerHTML = `<hb-default-layout><hb-schema-conversion-screen ></hb-schema-conversion-screen></<hb-default-layout>`;
  },
};

// Instructions Component
const InstructionsComponent = {
  render: () => {
    document.getElementById(
      "app"
    ).innerHTML = `<hb-default-layout><hb-instructions></hb-instructions></<hb-default-layout>`;
  },
};

// Error component (for any unrecognized path)
const ErrorComponent = {
  render: () => {
    return `
      <section>
        <h1>Error</h1>
      </section>
    `;
  },
};

// Pre defined paths
const paths = {
  defaultPath: "/",
  schemaReport: "/schema-report",
  instructions: "/instructions",
};

// Pre defined routes
const routes = [
  { path: paths.defaultPath, component: HomeComponent },
  { path: paths.schemaReport, component: SchemaComponent },
  { path: paths.instructions, component: InstructionsComponent },
];

// function to fetch browser url
const parseLocation = () =>
  location.hash.slice(1).toLowerCase() || paths.defaultPath;

// function to find component based on browser url
const findComponentByPath = (path, routes) => {
  return (
    routes.find((r) => {
      return r.path.match(new RegExp(`^\\${path}$`, "gm"));
    }) || undefined
  );
};

// function to render the html based on path
const router = () => {
  const path = parseLocation();
  const { component = ErrorComponent } =
    findComponentByPath(path, routes) || {};
  component.render();
};

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
window.addEventListener('scroll',()=>{Actions.setPageYOffset(window.scrollY)})