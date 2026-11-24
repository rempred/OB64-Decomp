typedef unsigned char u8;
typedef signed int s32;
u8 D_8016FF5C(u8 a, u8 b);
s32 D_801C8B68(u8 *u);
s32 D_801C8C58(u8 *u);
s32 func_002AB6BC(s32 id, s32 *pa, s32 *pb, u8 *u) {
    s32 a = *pa;
    s32 b = *pb;
    if (a == -1 && D_801C8B68(u)) {
        return 0;
    }
    if (b == -1 && !D_801C8B68(u)) {
        return 0;
    }
    if (a == -2 && D_801C8B68(u) && D_801C8C58(u)) {
        return 0;
    }
    if (b == -2 && !D_801C8B68(u) && D_801C8C58(u)) {
        return 0;
    }
    if (a == 0 && D_801C8B68(u)) {
        return 1;
    }
    if (b == 0 && !D_801C8B68(u)) {
        return 1;
    }
    if (D_8016FF5C(a, id)) {
        *pa = 0;
        return 0;
    }
    if (D_8016FF5C(b, id)) {
        *pb = 0;
        return 0;
    }
    return 1;
}
s32 D_801C8C58(u8 *u);
