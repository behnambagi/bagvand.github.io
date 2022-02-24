'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "5fe1021ea09b5092ac05525818164f67",
"/": "5fe1021ea09b5092ac05525818164f67",
"main.dart.js": "4346632f4debfe170c5e0578f348cd99",
"canvaskit/canvaskit.js": "43fa9e17039a625450b6aba93baf521e",
"canvaskit/profiling/canvaskit.js": "f3bfccc993a1e0bfdd3440af60d99df4",
"canvaskit/profiling/canvaskit.wasm": "a9610cf39260f60fbe7524a785c66101",
"canvaskit/canvaskit.wasm": "04ed3c745ff1dee16504be01f9623498",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"assets/NOTICES": "46d4f92725dbc066ee95076eb1714bdc",
"assets/FontManifest.json": "927f2f13a2d04e1dbe1ab15efbdb72fa",
"assets/assets/images/man.png": "6459a78b8d655079c08d4249cbcc0db5",
"assets/assets/images/me.png": "bc71075c2873e782a72523d790c34531",
"assets/assets/images/shot_home.png": "142acbd2ab909b8efcb114631689e2f0",
"assets/assets/DKB_CV.pdf": "efc1b8be175f68fd194a673c77847691",
"assets/assets/fonts/MySocialIcons.ttf": "345787fe6cbe5bf827f3a84436278f6f",
"assets/assets/fonts/Ubuntu-Regular.ttf": "2505bfbd9bde14a7829cc8c242a0d25c",
"assets/assets/fonts/Ubuntu-Medium.ttf": "8e22c2a6e3a3c679787e763a97fa11f7",
"assets/assets/fonts/Ubuntu-Bold.ttf": "e00e2a77dd88a8fe75573a5d993af76a",
"assets/AssetManifest.json": "42b662021fa420d801b77bba5b91b725",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"version.json": "2e5718ddc601847d341ce2c7a7f54a49",
"manifest.json": "441056b4d9bc2f998c00e5f5d5778185",
"icons/android-icon-144x144.png": "60e744af1049bcb0e2fdafcb50154b16",
"icons/apple-icon-144x144.png": "60e744af1049bcb0e2fdafcb50154b16",
"icons/ms-icon-310x310.png": "d2e8b51eb410d2645a176048c58f582d",
"icons/apple-icon-72x72.png": "7955dcd0d506c402f16e05a15d55d958",
"icons/android-icon-192x192.png": "d1d0fa9738603f7ab23e2293538b502a",
"icons/apple-icon-76x76.png": "6a85a123aa6de1707b8b5fd01a91776f",
"icons/apple-icon-precomposed.png": "e8a067d2da2c5bd075758d53b9c06f5e",
"icons/apple-icon.png": "e8a067d2da2c5bd075758d53b9c06f5e",
"icons/apple-icon-180x180.png": "6afa0b1da5eaf864c48785073672d01c",
"icons/apple-icon-152x152.png": "18f7758d3f17dd128b5e8d2921bd2244",
"icons/apple-icon-60x60.png": "324740928c9fdc908991fd4237636ccb",
"icons/ms-icon-150x150.png": "da5d649427b1373d15792e4fdf262633",
"icons/favicon-16x16.png": "8f50a5aa46a42009ba49572c57849b44",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/android-icon-96x96.png": "ac254161b5bb4100fbef72b25bffb8d4",
"icons/android-icon-48x48.png": "dcfdc4188bf5fce7c62892ba730d0c62",
"icons/favicon-96x96.png": "ac254161b5bb4100fbef72b25bffb8d4",
"icons/ms-icon-70x70.png": "ad0250d130daa551d29012e977914d38",
"icons/favicon-32x32.png": "3bc16a8a96369351bb4b1d64c9a0003c",
"icons/ms-icon-144x144.png": "60e744af1049bcb0e2fdafcb50154b16",
"icons/favicon.ico": "05b154e05f3e4b4030b7c3a3fc7542ad",
"icons/apple-icon-114x114.png": "9218b3fcc67659f75620f7be9a85bff6",
"icons/android-icon-36x36.png": "5a2fcef193af1c47e1876cd6f7910c4d",
"icons/apple-icon-57x57.png": "965c68d8d89577be897b033586bf006d",
"icons/android-icon-72x72.png": "7955dcd0d506c402f16e05a15d55d958",
"icons/apple-icon-120x120.png": "fc4f18070dbd9301dcf638ee3e1ff826"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
