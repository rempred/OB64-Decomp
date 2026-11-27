#include "game/route_record.h"

typedef float f32;
f32 func_0002CB80(f32 x, f32 z);
f32 func_0011AD7C(RouteRecord *s) {
    f32 k = 0.01f;
    f32 x;
    f32 z;
    func_0011A9B8(k, &x, &z, s->field08, s->field00, s->field04, s->field0C, s->field10, s->field14);
    k = k / func_0002CB80(x - *s->field00, z - *s->field04);
    k *= 45.0f;
    return k / 3840.0f;
}
