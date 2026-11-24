typedef unsigned char u8;
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
extern inline s32 GroupFirst(s32 n) {
    s32 k = 0;
    u8 lastB = 0;
    u16 lastH = 0;
    s32 i;
    TimeStamp *e;
    for (i = 0; i < 121; i++) {
        e = func_0028ab74(i);
        if (e == ((void *)0)) {
            break;
        }
        if (lastH != e->hi) {
            lastH = e->hi;
            lastB = e->mid;
            k++;
        } else if (lastB != e->mid) {
            k++;
            lastB = e->mid;
        }
        if (n == k - 1) {
            return i;
        }
    }
    return k;
}
s32 func_000238B0(signed char *buf, const signed char *fmt, ...);
void func_0002C950(signed char *dst, signed char *src);
extern signed char D_8023E0A0[];
extern signed char D_8023E338[];
s32 func_000238B0(signed char *buf, const signed char *fmt, ...);
void func_0002C950(signed char *dst, signed char *src);
u8 *func_002952D4(u8 *w, s32 n) {
    signed char buf[0x64];
    TimeStamp *e;
    bzero(w, 0x500);
    e = func_0028ab74(GroupFirst(n));
    bzero(buf, 0x64);
    func_000238B0(buf, D_8023E338, D_8023E0A0, e->hi);
    (*(u8 * *)((u8 *)(w) + (0x530))) = w;
    func_0002C950((signed char *)w, buf);
    return w;
}
extern signed char D_8023E0A0[];
s32 func_000238B0(signed char *buf, const signed char *fmt, ...);
void func_0002C950(signed char *dst, signed char *src);
