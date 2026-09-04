typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef signed long long s64;
typedef unsigned long long u64;
typedef float f32;
typedef double f64;
typedef s32 M2C_UNK;
typedef s8 M2C_UNK8;
typedef s16 M2C_UNK16;
typedef s32 M2C_UNK32;
typedef s64 M2C_UNK64;
M2C_UNK func_000521fc(s32);                                     
s32 func_0020BFE4();                                            
s32 func_0020C014(void *);                                      
s32 func_0020C0CC(void *);                                      
void *func_0020C478(s32);                                       
M2C_UNK func_0021AE6C(M2C_UNK, M2C_UNK);                        

void func_0021B0A0(void) {
    M2C_UNK var_f12_147;
    s32 temp_a0_113;
    s32 temp_a0_130;
    s32 temp_a0_96;
    s32 var_s1_9;
    s32 var_v0_38;
    u16 *var_v0_62;
    u8 temp_a0_46;
    u8 temp_a0_64;
    u8 temp_v0_107;
    u8 temp_v0_124;
    u8 temp_v0_90;
    void *temp_a0_106;
    void *temp_a0_123;
    void *temp_a0_89;
    void *temp_v0_19;

    var_s1_9 = 0;
    do {
        temp_v0_19 = func_0020C478(var_s1_9);
        if ((temp_v0_19 != 0) && (func_0020C0CC(temp_v0_19) == 0) && ((*(u8 *)((s8 *)(temp_v0_19) + (0xF6))) != 0)) {
            if (func_0020C014(temp_v0_19) != 0) {
                var_v0_38 = (s32) *(u8 *)0x801976DC < 0x1E;
            } else {
                var_v0_38 = (s32) *(u8 *)0x801976E8 < 0x1E;
            }
            if (var_v0_38 != 0) {
                temp_a0_46 = (*(u8 *)((s8 *)(temp_v0_19) + (0xF6)));
                if (temp_a0_46 < 0x64U) {
                    (*(u16 *)((s8 *)(((temp_a0_46 * 0x38) + 0x80190000)) + (0x3BD8))) = (u16) (*(u16 *)((s8 *)(temp_v0_19) + (0x20)));
                    var_s1_9 += 1;
                } else {
                    var_v0_62 = (temp_a0_46 * 2) + 0x80190EBC;
                    goto block_14;
                }
            } else {
                temp_a0_64 = (*(u8 *)((s8 *)(temp_v0_19) + (0xF6)));
                if (temp_a0_64 < 0x64U) {
                    (*(u16 *)((s8 *)(((temp_a0_64 * 0x34) + 0x80190000)) + (0x5578))) = (u16) (*(u16 *)((s8 *)(temp_v0_19) + (0x20)));
                    var_s1_9 += 1;
                } else {
                    var_v0_62 = (temp_a0_64 * 2) + 0x8019532C;
block_14:
                    *var_v0_62 = (*(u16 *)((s8 *)(temp_v0_19) + (0x20)));
                    goto block_15;
                }
            }
        } else {
block_15:
            var_s1_9 += 1;
        }
    } while (var_s1_9 < 0x14);
    temp_a0_89 = *(void **)0x801CE8BC;
    temp_v0_90 = (*(u8 *)((s8 *)(temp_a0_89) + (0x5744)));
    if (temp_v0_90 != 0) {
        (*(u8 *)((s8 *)(temp_a0_89) + (0x5744))) = (u8) (temp_v0_90 - 1);
    } else {
        temp_a0_96 = (*(s32 *)((s8 *)(temp_a0_89) + (0x5748)));
        if (temp_a0_96 != 0) {
            func_000521fc(temp_a0_96);
            (*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x5748))) = 0;
        }
    }
    temp_a0_106 = *(void **)0x801CE8BC;
    temp_v0_107 = (*(u8 *)((s8 *)(temp_a0_106) + (0x5745)));
    if (temp_v0_107 != 0) {
        (*(u8 *)((s8 *)(temp_a0_106) + (0x5745))) = (u8) (temp_v0_107 - 1);
    } else {
        temp_a0_113 = (*(s32 *)((s8 *)(temp_a0_106) + (0x574C)));
        if (temp_a0_113 != 0) {
            func_000521fc(temp_a0_113);
            (*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x574C))) = 0;
        }
    }
    temp_a0_123 = *(void **)0x801CE8BC;
    temp_v0_124 = (*(u8 *)((s8 *)(temp_a0_123) + (0x57D0)));
    if (temp_v0_124 != 0) {
        (*(u8 *)((s8 *)(temp_a0_123) + (0x57D0))) = (u8) (temp_v0_124 - 1);
    } else {
        temp_a0_130 = (*(s32 *)((s8 *)(temp_a0_123) + (0x57D4)));
        if (temp_a0_130 != 0) {
            func_000521fc(temp_a0_130);
            (*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x57D4))) = 0;
        }
    }
    if (*(s32 *)0x801CE8C4 != 0) {
        var_f12_147 = 0x3FCCCCCD;
        if (func_0020BFE4() != 0) {
            var_f12_147 = 0x3F800000;
        }
    } else {
        var_f12_147 = 0;
    }
    func_0021AE6C(var_f12_147, 0);
}
