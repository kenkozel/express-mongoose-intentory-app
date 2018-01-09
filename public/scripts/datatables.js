$(document).ready(function() {
    $('#datatable').DataTable( {
        "scrollX": false,
        dom: 'Bfrtip',
        buttons: [
            'print',
	    'pdf'	
        	 ]
    } );
} );

$(document).ready(function() {
    $('table.display').DataTable();
} );

