typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void *func_00001330(unsigned int size);
void *func_000016C4(void *ptr);
void bzero(void *p, s32 n);
void *func_001B8CDC(s32 a, s32 b, s32 c, s32 d, s32 e);
typedef struct {
    u32 id;
    s32 chunk;
    s32 *chunks;
    u32 kind;
    u32 byte10;
    u32 byte14;
    s32 count;
    s32 hdr1C;
    s32 hdr20;
    s32 hdr24;
    u8 *buf;
    u8 *bufEnd;
    s32 unk30;
    u8 *words;
    u8 *bytes38;
    u8 *bytes3C;
    void *res40;
    void *res44;
    u8 *bytes48;
    u8 *bytes4C;
    void *res50;
} SprRec;
typedef struct {
    u32 cell;
    s32 x;
    s32 y;
    u32 w;
    u32 h;
    u32 z;
    f32 u;
    f32 v;
} SprPart;
typedef struct {
    u32 idx;
    u32 n;
    SprPart part[1];
    void *img[1];
} SprFrame;
extern u8 D_8021C800[];
SprFrame *func_001B8730(SprFrame *out, SprRec *r, s32 cls, s32 b, s32 c, s32 d, s32 e, u32 idx);
SprRec *func_001B8A0C(SprRec *o, s32 cls, s32 b, s32 c, s32 d, s32 e);
typedef struct {
    u32 n;
    u32 v[16];
    u32 id[16];
} SprList;
typedef struct {
    SprList l[2];
    u32 nFrames;
    SprFrame frames[16];
} SprSet;
void *func_001B8CDC(s32 cls, s32 b, s32 c, s32 d, s32 e) {
    SprRec rec;
    SprRec *r;
    SprSet *o;
    u8 *base;
    u8 *p;
    u8 n;
    u32 i;
    r = func_001B8A0C(&rec, cls, b, c, d, e);
    if (r == ((void *)0)) {
        return ((void *)0);
    }
    o = func_00001330(sizeof(SprSet));
    bzero(o, sizeof(SprSet));
    base = r->res40;
    {
        u32 j;
        p = base + *(u32 *)(base + 0x14);
        n = *p++;
        for (i = 0; i < n; i++) {
            if (*p == 1) {
                o->l[0].id[o->l[0].n] = p[1];
                o->l[0].v[o->l[0].n] = p[2] >> 1;
                for (j = 0; j < o->nFrames; j++) {
                    if (o->frames[j].idx == p[1]) {
                        break;
                    }
                }
                if (j >= o->nFrames) {
                    func_001B8730(&o->frames[o->nFrames], r, cls, b, c, d, e, p[1]);
                    o->nFrames++;
                }
                o->l[0].n++;
            }
            p += D_8021C800[*p];
        }
    }
    {
        u32 j;
        p = base + *(u32 *)base;
        n = *p++;
        for (i = 0; i < n; i++) {
            if (*p == 1) {
                o->l[1].id[o->l[1].n] = p[1];
                o->l[1].v[o->l[1].n] = p[2] >> 1;
                for (j = 0; j < o->nFrames; j++) {
                    if (o->frames[j].idx == p[1]) {
                        break;
                    }
                }
                if (j >= o->nFrames) {
                    func_001B8730(&o->frames[o->nFrames], r, cls, b, c, d, e, p[1]);
                    o->nFrames++;
                }
                o->l[1].n++;
            }
            p += D_8021C800[*p];
        }
    }
    {
        u32 k;
        for (k = 0; k < r->count; k++) {
            func_000016C4(((void **)r->words)[k]);
        }
    }
    func_000016C4(r->chunks);
    func_000016C4(r->res44);
    func_000016C4(r->res40);
    func_000016C4(r->res50);
    func_000016C4(r->buf);
    return o;
}
