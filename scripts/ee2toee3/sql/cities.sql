SELECT CONCAT(

'{ ',

'"_id" : { ',
    '"$oid" : "', LPAD(LOWER(conv(id, 10, 16)), 24, "0"), '" ',
'} , '

'"slug" : "',
REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
CONCAT(slug, ' '), '-ac ', ''),
'-al ', ''),
'-am ', ''),
'-ap ', ''),
'-ba ', ''),
'-ce ', ''),
'-df ', ''),
'-es ', ''),
'-go ', ''),
'-ma ', ''),
'-mg ', ''),
'-ms ', ''),
'-mt ', ''),
'-pa ', ''),
'-pb ', ''),
'-pe ', ''),
'-pi ', ''),
'-pr ', ''),
'-rj ', ''),
'-rn ', ''),
'-ro ', ''),
'-rr ', ''),
'-rs ', ''),
'-sc ', ''),
'-se ', ''),
'-sp ', ''),
'-to ', '')
, '" , ',

'"name" : "', name, '" , ',

'"state" : ',
    '{ "$oid" : "', LPAD(LOWER(conv(region_id, 10, 16)), 24, "0"),'" } ',

'}'

) from cities