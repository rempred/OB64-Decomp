struct Panel;
typedef signed int s32;
extern struct Panel *D_801EB280;
extern struct Panel *D_801EB284;
void D_8017C384(struct Panel *);
void func_001324E8(void) {
    struct Panel **p = &D_801EB280;
    if (*p != 0) {
        D_8017C384(*p);
        *p = 0;
    }
    D_8017C384(D_801EB284);
    D_801EB284 = 0;
}
