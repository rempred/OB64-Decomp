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
struct _m2c_stack_func_0021840C {
               char pad0[0x10];
               s32 sp10;                                          
               s32 sp14;                                          
               M2C_UNK sp18;                                      
               char pad18[4];
               M2C_UNK sp1C;                                      
               char pad1C[0x34];
};                                                                   

M2C_UNK func_001F0E64(void *, M2C_UNK);                         
M2C_UNK func_0020BD5C(M2C_UNK);                                 
s32 func_0020BF7C();                                            
s32 func_0020BF8C();                                            
s32 func_0020BFE4();                                            
s32 func_0020C014(void **);                                     
s32 func_0020C2C0(void **);                                     
s32 func_0020C32C(void **);                                     
void **func_0020C478(s32);                                      
M2C_UNK func_0021824C(s32 *, s32 *, M2C_UNK *, M2C_UNK *);             
M2C_UNK func_0021EAF0(void **);                                 
u16 func_002224F4();                                            

void func_0021840C(void) {
    s32 sp10;
    s32 sp14;
    M2C_UNK sp18;
    M2C_UNK sp1C;
    M2C_UNK var_a0_252;
    M2C_UNK var_a1_119;
    s16 temp_v0_98;
    s16 var_v0_73;
    s32 temp_a1_176;
    s32 temp_v1_151;
    s32 var_a0_102;
    s32 var_s1_224;
    s32 var_s1_67;
    s32 var_s3_49;
    s32 var_s4_19;
    s32 var_v0_117;
    s8 var_a1_179;
    u16 temp_v0_250;
    void **temp_s1_93;
    void **temp_v0_226;
    void **temp_v0_54;
    void **var_s0_68;
    void **var_s0_92;
    void *temp_a0_70;
    void *temp_a2_150;
    void *temp_v0_95;
    void *temp_v1_23;

    var_s4_19 = 0x1E;
    if (func_0020BFE4() != 0) {
        var_s4_19 = 0x3C;
    }
    temp_v1_23 = *(void **)0x801CE8BC;
    if ((*(s32 *)((s8 *)(temp_v1_23) + (0x6048))) == 0) {
        *(s8 *)0x801CEAAE = 0;
        *(s8 *)0x801CEAAD = 0;
        *(s8 *)0x801CEAAC = 0;
        *(s8 *)0x801CEAAB = 0;
    }
    (*(s32 *)((s8 *)(temp_v1_23) + (0x6048))) = (s32) ((*(s32 *)((s8 *)(temp_v1_23) + (0x6048))) + 1);
    func_0021824C(&sp10, &sp14, &sp18, &sp1C);
    if ((*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x6048))) < 0x4C) {
        var_s3_49 = 0;
        do {
            temp_v0_54 = func_0020C478(var_s3_49);
            if ((func_0020C2C0(temp_v0_54) == 0) && (func_0020C32C(temp_v0_54) == 0)) {
                func_0021EAF0(temp_v0_54);
                var_s1_67 = 0;
                var_s0_68 = temp_v0_54;
                do {
                    temp_a0_70 = *var_s0_68;
                    if (temp_a0_70 != 0) {
                        var_v0_73 = (*(s16 *)((s8 *)(temp_a0_70) + (0x48)));
                        if (var_v0_73 == 0x20) {
                            func_001F0E64(temp_a0_70 + 0x44, 0x21);
                            var_v0_73 = (*(s16 *)((s8 *)(*var_s0_68) + (0x48)));
                        }
                        if (var_v0_73 == 0x22) {
                            func_001F0E64(*var_s0_68 + 0x44, 0x23);
                        }
                    }
                    var_s1_67 += 1;
                    var_s0_68 += 4;
                } while (var_s1_67 < 3);
                var_s0_92 = temp_v0_54;
                temp_s1_93 = var_s0_92 + 0xC;
                do {
                    temp_v0_95 = *var_s0_92;
                    if (temp_v0_95 != 0) {
                        temp_v0_98 = (*(s16 *)((s8 *)(temp_v0_95) + (0x48)));
                        var_a0_102 = 0;
                        if ((temp_v0_98 < 5) || ((u32) ((temp_v0_98 - 0x32) & 0xFFFF) < 5U)) {
                            var_a0_102 = 1;
                        }
                        if (var_a0_102 != 0) {
                            if (func_0020C014(temp_v0_54) != 0) {
                                var_v0_117 = sp10;
                                var_a1_119 = 8;
                                if (var_v0_117 == 0) {
                                    goto block_28;
                                }
                                goto block_26;
                            }
                            var_v0_117 = sp14;
                            var_a1_119 = 8;
                            if (var_v0_117 == 0) {
                                goto block_28;
                            }
block_26:
                            if (var_v0_117 == 3) {
                                var_a1_119 = 0x24;
block_28:
                                func_001F0E64(*var_s0_92 + 0x44, var_a1_119);
                            }
                        }
                    }
                    var_s0_92 += 4;
                } while ((u32) var_s0_92 < (u32) temp_s1_93);
            }
            var_s3_49 += 1;
        } while (var_s3_49 < 0x14);
    }
    temp_a2_150 = *(void **)0x801CE8BC;
    temp_v1_151 = (*(s32 *)((s8 *)(temp_a2_150) + (0x6048)));
    if (temp_v1_151 < 0x10) {
        *(void **)0x801CEAAB = (s8) (temp_v1_151 * 0xC);
        return;
    }
    if (temp_v1_151 < var_s4_19) {
        (*(s32 *)((s8 *)(temp_a2_150) + (0x604C))) = (s32) ((*(s32 *)((s8 *)(temp_a2_150) + (0x604C))) | 1);
        return;
    }
    if (temp_v1_151 < (var_s4_19 + 0x10)) {
        temp_a1_176 = (0x10 - (temp_v1_151 - var_s4_19)) * 0xC;
        var_a1_179 = temp_a1_176 & ((s32) ~temp_a1_176 >> 0x1F);
        if (var_a1_179 >= 0x100) {
            var_a1_179 = -1;
        }
        *(u16 *)0x801D0758 = (*(u16 *)0x801D0758 + 0x11) - ((*(s32 *)((s8 *)(temp_a2_150) + (0x6048))) - var_s4_19);
        *(void **)0x801D075C = (u16) (*(u16 *)0x801D075C - 0x11 + ((*(s32 *)((s8 *)(temp_a2_150) + (0x6048))) - var_s4_19));
        *(void **)0x801CEAAB = var_a1_179;
        (*(s32 *)((s8 *)(temp_a2_150) + (0x604C))) = (s32) ((*(s32 *)((s8 *)(temp_a2_150) + (0x604C))) & ~1);
        return;
    }
    if (((func_0020BF8C() != 0) || (func_0020BF7C() != 0)) && ((*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6087))) == 1)) {
        var_s1_224 = 0;
        do {
            temp_v0_226 = func_0020C478(var_s1_224);
            if (temp_v0_226 != 0) {
                if (func_0020C014(temp_v0_226) != 0) {
                    (*(s16 *)((s8 *)(temp_v0_226) + (0x20))) = 0;
                }
            }
            var_s1_224 += 1;
        } while (var_s1_224 < 0x14);
        (*(u16 *)((s8 *)(*(void **)0x801CE8BC) + (0x606A))) = func_002224F4();
    }
    temp_v0_250 = (*(u16 *)((s8 *)(*(void **)0x801CE8BC) + (0x606A)));
    var_a0_252 = 4;
    if (temp_v0_250 != 0) {
        if (!(temp_v0_250 & 0x800)) {
            var_a0_252 = 0xA;
        }
    }
    func_0020BD5C(var_a0_252);
}
