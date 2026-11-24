typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 unk00[2];
    u16 hi;
    u8 mid;
    u8 lo;
} TimeStamp;
void bzero(void *p, s32 n);
TimeStamp *func_0028ab74(u8 i);
void bzero(void *p, s32 n);
void bzero(void *p, s32 n);
extern signed char *D_8023E060[];
s32 func_000238B0(signed char *buf, const signed char *fmt, ...);
void func_0002C950(signed char *dst, signed char *src);
extern signed char D_8023E0A0[];
s32 func_000238B0(signed char *buf, const signed char *fmt, ...);
void func_0002C950(signed char *dst, signed char *src);
extern inline s16 func_002953E0(s32 line) {
    s32 k = 0;
    u8 lastB = 0;
    u16 lastH = 0;
    s32 i;
    u8 *e;
    for (i = 0; i < 121; i++) {
        e = (u8 *)func_0028ab74(i);
        if (e == ((void *)0)) {
            break;
        }
        if (lastH != *(u16 *)(e + 2)) {
            lastB = e[4];
            lastH = *(u16 *)(e + 2);
            if (line == k) {
                return i;
            }
            k++;
        } else if (lastB != e[4]) {
            if (line == k) {
                return i;
            }
            k++;
            lastB = e[4];
        }
        if (line == k) {
            return i;
        }
        k++;
    }
    return k;
}
extern signed char D_8023E378[];
u8 *func_00295A54(u8 *w, s32 line) {
    signed char buf[0x64];
    TimeStamp *e;
    bzero(w, 0x500);
    e = func_0028ab74(func_002953E0(line));
    bzero(buf, 0x64);
    func_000238B0(buf, D_8023E378, D_8023E0A0, e->hi, D_8023E060[e->mid], e->lo);
    (*(u8 * *)((u8 *)(w) + (0x530))) = w;
    func_0002C950((signed char *)w, buf);
    return w;
}
extern signed char D_8023E378[];
extern signed char D_8023E0A0[];
extern signed char *D_8023E060[];
s32 func_000238B0(signed char *buf, const signed char *fmt, ...);
void func_0002C950(signed char *dst, signed char *src);
