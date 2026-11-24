typedef unsigned char u8;
typedef signed int s32;
typedef struct {
    s32 unk00;
    s32 request;
    s32 command;
    s32 fade;
    u8 unk10[0x14];
    s32 handle;
    s32 unk28;
    s32 saved[3];
    s32 unk38;
    s32 param;
    u8 unk40[0xC];
    s32 pending;
} SoundChannel;
extern SoundChannel D_800EB0B0[];
s32 func_00011f08(s32 h);
s32 func_00011e54(s32 h, s32 a);
void func_0003fa18(SoundChannel *ch);
void func_0003f974(SoundChannel *ch);
void func_0003f974(SoundChannel *ch) {
    if (!func_00011f08(ch->handle)) {
        D_800EB0B0[0].unk38 = 0;
        func_0003fa18(ch);
        return;
    }
    if (ch->unk38 == 0) {
        if (ch->saved[2] != 0) {
            func_00011e54(ch->handle, ch->saved[2]);
            (*(s32 *)((u8 *)(ch) + (0x3C))) = ch->saved[2] + 3;
        } else {
            func_00011e54(ch->handle, 1);
            (*(s32 *)((u8 *)(ch) + (0x3C))) = 3;
        }
        ch->unk38 = 2;
        (*(s32 *)((u8 *)(ch) + (0x40))) = ch->saved[0];
    } else {
        (*(s32 *)((u8 *)(ch) + (0x40))) = ch->saved[0];
    }
}
