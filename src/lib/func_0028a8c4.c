typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef struct {
    u16 year;
    u8 month;
    u8 day;
} Date28;
extern u8 D_80196A32;
extern u8 D_80196A33;
extern Date28 D_80196A72;
extern Date28 D_8023DC9C[];
extern Date28 D_8023DCF8[];
extern Date28 D_8023DE84;
extern Date28 D_8023DEAC;
extern Date28 D_8023DEF4;
extern Date28 D_8023DF00;
extern Date28 D_8023DF08;
extern u16 D_80196A30;
s16 func_0028a8c4(s16 id) {
    Date28 *d;
    s16 age;
    if (id == 0xDC) {
        d = &D_8023DEAC;
    } else if (id == 0xDD) {
        d = &D_8023DE84;
    } else if (id < 0x54) {
        d = &D_80196A72;
    } else if (id == 0xB7) {
        d = &D_8023DEF4;
    } else if ((u16)(id - 0x99) < 3) {
        d = &D_8023DC9C[id];
    } else if (id == 0x96) {
        d = &D_8023DF08;
    } else if (id < 0xC8) {
        d = &D_8023DCF8[id];
    } else {
        d = &D_8023DF00;
    }
    age = D_80196A30 - d->year;
    if (d->month * 30 + d->day <= D_80196A32 * 30 + D_80196A33) {
        age++;
    }
    return age;
}
