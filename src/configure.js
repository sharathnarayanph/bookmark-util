$(function () {

    //Load list during load
    $(function () {
        chrome.storage.sync.get("configData", function (data) {
            generateList(data.configData);
        });
    });

    //Save config data in chrome storage
    $("#saveConfig").click(function () {
        var configData = [];
        var key, value;

        $("#configTbl tbody tr").each(function () {
            key = this.children[1].children[0].value;
            value = this.children[2].children[0].value;

            configData.push({ folder: key, keywords: value });
        });

        if (configData) {
            chrome.storage.sync.set({ "configData": configData }, function () {
                close();
            });
        }
    });

    //Add new row
    $("#addRow").click(function () {
        var element;
        var id;

        if ($('#configTbl tr:last td:first').length == 0) {
            id = 0;
            element = $('#configTbl tbody');
        }
        else {
            id = $('#configTbl tr:last td:first')[0].innerText;
            element = $('#configTbl tr:last')
        }

        var content = "<tr><td>" + (parseInt(id) + 1) + "</td>";
        content += "<td><input type=\"text\"";
        content += "value=\"\" placeholder=\"Enter folder name\" /></td>";
        content += "<td><input type=\"text\"";
        content += "value=\"\" placeholder=\"Enter keywords separated by comma\" /></td>";

        if (element[0].localName == "tbody") {
            $(element).append(content);
        }
        else {
            $(element).after(content);
        }
    });

    function generateList(configData) {
        var content;

        for (var i = 0; i < configData.length; i++) {
            content = "<tr><td>" + (parseInt(i) + 1) + "</td>";
            content += "<td><input type=\"text\"";
            content += "value=\"" + configData[i].folder + "\" placeholder=\"Enter folder name\" /></td>";
            content += "<td><input type=\"text\"";
            content += "value=\"" + configData[i].keywords + "\" placeholder=\"Enter keywords separated by comma\" /></td>";

            if (i == 0) {
                $('#configTbl tbody').append(content);
            }
            else {
                $('#configTbl tr:last').after(content);
            }
        }
    }
});

