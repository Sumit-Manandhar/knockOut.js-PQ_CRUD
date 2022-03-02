const pqOptions = {
    width: "auto",
    height: 470,
    showTitle: false,
    showHeader: true,
    showTop: true,
    showToolbar: false,
    showBottom: true,
    wrap: true,
    hwrap: false,
    sortable: false,
    editable: true,
    resizable: true,
    collapsible: false,
    draggable: true,
    dragColumns: { enabled: true },
    scrollModel: { autoFit: true },
    numberCell: { show: true, resizable: true, title: "S.N.", minWidth: 30 },
    pageModel: { curPage: 1, rPP: 10, type: "local" },
    columnTemplate: { wrap: true, editable: false, dataType: "string", halign: "center", hvalign: "center", resizable: true, styleHead: { 'font-weight': "bold" } },
};

function IndexVM() {
    const self = this;

    var isNullOrEmpty = function(str) {
        if (str === undefined || str === null) {
            return true;
        } else if (typeof str === "string") {
            return (str.trim() === "");
        } else {
            return false;
        }
    };





    const models = {
        MyModel: function(item) {
            item = item || {};
            this.Name = ko.observable(item.Name || "");
            this.Address = ko.observable(item.Address || "");
            this.Email = ko.observable(item.Email || "");
            this.Phone = ko.observable(item.phone || "");


            //  this.Age = ko.observable(item.Age || 1);

            this.GenderId = ko.observable(item.GenderId || "");
            this.GenderName = ko.observable(item.GenderName || "");

            this.Date = ko.observable(item.Date || "")

        },
        UiElements: function() {
            self.MyModel = ko.observable(new models.MyModel());
            self.DataList = ko.observableArray([]);
            self.SelectedTransaction = ko.observable();
            self.GenderList = ko.observableArray([
                { Text: 'Male', Value: '1' },
                { Text: 'Female', Value: '0' }
            ]);


        },
    };

    self.SaveInformation = function() {

        if (UiEvents.validate.SaveValidation()) {

            UiEvents.functions.Save();

        }
    };
    self.deleteRow = function(id) {
        UiEvents.functions.Delete(id);
    };
    self.editRow = function(id) {
        debugger;
        var RowID = id;
        var selectItem = $("#demoGrid").pqGrid("getRowData", { rowIndxPage: Number(RowID) });

        self.SelectedTransaction(RowID);
        self.MyModel().Name(selectItem.Name);
        self.MyModel().GenderId(selectItem.GenderId);
        self.MyModel().Address(selectItem.Address);
        self.MyModel().Phone(selectItem.Phone);
        self.MyModel().Email(selectItem.Email);
        self.MyModel().Date(selectItem.Date);

    }



    const UiEvents = {
        validate: {
            SaveValidation: function(item) {
                if (isNullOrEmpty(self.MyModel().Name())) {
                    alert("enter the name!!!");
                    return false;
                } else if (isNullOrEmpty(self.MyModel().GenderId())) {
                    alert("Gender cannot be empty...!!!");
                    return false;

                } else if (isNullOrEmpty(self.MyModel().Address())) {
                    alert("please enter the address!!!");
                    return false;

                } else if (isNullOrEmpty(self.MyModel().Date())) {
                    alert("please enter the dob!!!");
                    return false;

                } else {
                    self.MyModel().GenderName((self.GenderList().find(X => X.Value == self.MyModel().GenderId()) || {}).Text);
                    if (isNullOrEmpty(self.SelectedTransaction())) {
                        debugger;
                        self.DataList.push(ko.toJS(self.MyModel()));
                    } else {
                        debugger;
                        self.DataList.splice(self.SelectedTransaction(), 1);
                        self.DataList.push(ko.toJS(self.MyModel()));
                        self.SelectedTransaction('');

                    }
                    debugger;

                    // 
                    return true;
                }
            }
        },

        clear: {
            ResetAll: function() {
                self.MyModel(new models.MyModel());
                self.DataList([]);
            },
        },
        functions: {
            Save: function() {

                if ($("#demoGrid").pqGrid("instance")) {

                    $("#demoGrid").pqGrid('option', 'dataModel.data', ko.toJS(self.DataList()));
                    $("#demoGrid").pqGrid('refreshDataAndView');
                } else {

                    const option = Object.assign({}, pqOptions);
                    option.colModel = [
                        { title: "Full Name", align: "center", dataIndx: "Name", width: "20%" },
                        { title: "ADDRESS", align: "center", dataIndx: "Address", width: "12%" },
                        { title: "Gender", align: "center", dataIndx: "GenderName", width: "10%" },
                        { title: "email", align: "center", dataIndx: "Email", width: "14%" },
                        { title: "phone", align: "center", dataIndx: "Phone", width: "14%" },
                        { title: "dob", align: "center", dataIndx: "Date", width: "12%" },
                        {
                            title: "delete",
                            align: "center",
                            render: function(ui) {
                                return `<button type='button' title='Delete' onclick='obj.deleteRow("${ui.rowIndx}")'>Delete</button>`
                            },
                            width: "10%"

                        },
                        {
                            title: "edit",
                            align: "center",
                            render: function(ui) {
                                return `<button type='button' title='edit' onclick='obj.editRow("${ui.rowIndx}")'>EDIT</button>`
                            },
                            width: "6%"

                        },
                    ];

                    option.dataModel = { data: ko.toJS(self.DataList()) };
                    $("#demoGrid").pqGrid(option);
                }
            },
            Delete: function(index) {
                self.DataList.splice(index, 1);
                UiEvents.functions.Save();
            },
            Edit: function(index) {
                self.DataList.splice(index)
            }
        },



    };

    function Init() {
        models.UiElements();
        UiEvents.clear.ResetAll();
        UiEvents.functions.Save();
    }
    Init();
}

var obj;

$(document).ready(function() {
    obj = new IndexVM();
    ko.applyBindings(obj);

});