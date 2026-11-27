#include "game/route_record.h"

float func_0002CB80(float x, float z);

float func_0011AE34(RouteRecord *record) {
    float k = 0.01f;
    float x;
    float z;
    func_0011A9B8(k, &x, &z, record->field08, record->field00, record->field04,
        record->field0C, record->field10, record->field14);
    return k / func_0002CB80(x - *record->field00, z - *record->field04);
}
