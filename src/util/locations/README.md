Validators here: https://github.com/echoes-xyz/mongoose-geojson-schema/blob/master/index.js

and / or schemas here: https://github.com/lykmapipo/mongoose-geojson-schemas

About GeoJSON: https://macwright.org/2015/03/23/geojson-second-bite.html#points

# Types

### Polygon

- in coordinate array, finish array with same coordinate as initial coordinate (necessary?)
- exterior polygons should list coordinates in counterclockwise, interior in clockwise
- Triple nested arrays?!?
- - [ [exterior Polygon coordinates array], [interior donut coordinates array], [second interior donut], [third, etc] ]
