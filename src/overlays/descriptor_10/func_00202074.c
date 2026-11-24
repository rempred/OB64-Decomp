typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 r, g, b, a;
} Color201;
s32 func_00202074(Color201 c) {
    Color201 out = c;
    s32 grey = ((out.r * 30) / 100 + (out.g * 59) / 100 + (out.b * 11) / 100) / 3;
    out.r = (u32)(grey * 220) / 100;
    out.g = (u32)(grey * 180) / 100;
    out.b = (u32)(grey * 120) / 100;
    return *(s32 *)&out;
}
