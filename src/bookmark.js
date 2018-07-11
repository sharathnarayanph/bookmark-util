var hashMap;

$(function () {
    chrome.storage.sync.get("configData", function (data) {
        hashMap = new Map();

        var configs = data.configData;
        for (var i = 0; i < configs.length; i++) {
            var keys = new Array();
            keys = configs[i].keywords.split(",");

            for(key in keys) {
                hashMap.set(keys[key], configs[i].folder);
            }
        }
    });
});

chrome.bookmarks.onCreated.addListener(function (id, bookmark) {
    var keys = new Array();
    keys = bookmark.title.split(" ");
    
    for(key in keys) {
        if(hashMap.get(keys[key])) {
            moveBookmark(bookmark.id, keys[key]);
        }
    }
});

function moveBookmark(id, key) {
    chrome.bookmarks.search(hashMap.get(key), function (bookmarks) {
        var folder = false;

        for(itr in bookmarks) {
            if(!bookmarks[itr].hasOwnProperty("url")) {
                folder = true;
                var dest = {   parentId : bookmarks[itr].id };

                chrome.bookmarks.move(id, dest, function (result) {
                    if(result) {
                        console.log("Moved the bookmark to the specified folder");
                    }
                });
            }
        }

        if(!folder) {
            createAndMove(id, key);
        }
    });    
}

function createAndMove(id, key) {
    var bookmark = { title : hashMap.get(key)};
    chrome.bookmarks.create(bookmark, function (result) {
        moveBookmark(id, key);    
    });                     
}
