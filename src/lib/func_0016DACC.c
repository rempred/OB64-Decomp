typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void D_80179018(void);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern s16 D_800E7A36;
extern s16 D_800E7A38;
extern s16 D_800E7A3A;
extern s16 D_800E7A3C;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_8018F480;
extern Gfx D_80186BD0[];
extern Gfx D_80186D90[];
void boot_display_list_flagged_rect_packet_emit(s32 a, s32 b, s32 c, s32 d);
void func_0016DCE4(void);
void func_0016DACC(void);
void func_0016DACC(void) {
    Gfx *g;
    boot_display_list_flagged_rect_packet_emit(D_800E7A36, D_800E7A38, D_800E7A3A, D_800E7A3C);
    D_80179018();
    D_8018F480 = 0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xDE000000;
    g->w1 = (u32)D_80186BD0;
    func_0016DCE4();
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xDE000000;
    g->w1 = (u32)D_80186D90;
}
