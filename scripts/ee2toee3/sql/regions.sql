SELECT CONCAT(

'{ ',

'"_id" : { ',
    '"$oid" : "', LPAD(LOWER(conv(id, 10, 16)), 24, "0"), '" ',
'} , '

'"slug" : "', slug, '" , ',

'"name" : "', name, '" , ',

'"symbol" : "', LOWER(symbol), '" , ',

'"country" : ',
    '{ "$oid" : "', LPAD(LOWER(conv(country_id, 10, 16)), 24, "0"),'" } ',

'}'

) from regions