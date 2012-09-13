app.ui.menu.navigation.add(
    {
        image : '',
        description : 'buscar',
        click : function() {
            app.Filter();
            app.Find();
        }//,
        //url : '/buscar'
    }
);

app.Route();