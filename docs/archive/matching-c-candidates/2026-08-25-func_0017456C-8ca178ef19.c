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
struct func_0017456C_scratch {
    f32 f0;
    f32 f1;
    s32 i2;
    s32 pad34;
    s32 a0;
    s32 a1;
    s32 a2;
    s32 pad44[3];
};
M2C_UNK func_00079618(M2C_UNK, M2C_UNK, M2C_UNK, M2C_UNK);             
M2C_UNK func_0017C384();                                        
void *func_0017F010(s32, M2C_UNK, M2C_UNK, M2C_UNK, s32, s32, s32, s32, s32, s32);             
M2C_UNK func_00186190(M2C_UNK, M2C_UNK);                        
s32 func_00186210(M2C_UNK);                                     
M2C_UNK func_001B8D44(f32, f32, s32, s32, s32);                 
M2C_UNK func_001DA340();                                        
s32 func_001DC054();                                            
M2C_UNK func_001DC95C(s32, s32);                                
s32 func_001DCF20();                                            
M2C_UNK func_001E00F0(M2C_UNK, s32, s32, s32, s32, s32);             
M2C_UNK func_0020CDA0(M2C_UNK);                                 
M2C_UNK func_00218C28();                                        
s32 func_00218C3C();                                            
M2C_UNK func_00218C7C();                                        
M2C_UNK func_00218D24();                                        

void func_0017456C(void) {
    struct func_0017456C_scratch scratch;
    s32 temp_a1_239;
    s32 temp_v0_524;
    s32 temp_v0_554;
    s32 temp_v1_523;
    s32 temp_v1_553;
    s32 var_a0_241;
    s32 var_v1_242;
    u16 temp_a0_216;
    u16 temp_a1_377;
    u16 temp_a1_455;
    u32 temp_v0_589;
    u32 temp_v0_621;
    u32 temp_v0_653;
    u32 temp_v1_115;
    u32 var_v0_168;
    u32 var_v0_326;
    u8 temp_v0_409;
    u8 temp_v0_583;
    u8 temp_v0_615;
    u8 temp_v0_647;
    u8 temp_v1_474;
    u8 temp_v1_504;
    u8 temp_v1_584;
    u8 temp_v1_616;
    u8 temp_v1_648;
    u8 temp_v1_691;
    u8 var_v0_507;
    void *temp_a0_369;
    void *temp_a0_447;
    void *temp_v0_766;
    void *temp_v1_215;
    void *temp_v1_376;
    void *temp_v1_454;

    temp_v1_115 = *(u32 *)0x80214F64;
    switch (temp_v1_115) {
    case 0x0:
        if (func_00218C3C() == 2) {
            *(u32 *)0x80214F64 = (u32) (*(u32 *)0x80214F64 + 1);
            func_00218C7C(&scratch.f0);
            func_001B8D44(scratch.f0, scratch.f1, scratch.i2, *(s32 *)0x8018F58C, 0x28);
            return;
        }
    default:
        return;
    case 0x1:
        func_00218D24();
        if ((*(u8 *)0x8018F481 == 2) && (func_00186210(0) == 0)) {
            func_00218C28();
            var_v0_168 = *(u32 *)0x80214F64 + 0x65;
        } else {
            var_v0_168 = *(u32 *)0x80214F64 + 1;
        }
block_103:
        *(u32 *)0x80214F64 = var_v0_168;
        break;
    case 0x2:
        if (*(u8 *)0x8021AC2C != 0) {
            if (func_00218C3C() == 1) {
                func_001DA340(-1, &scratch.f0);
                func_001B8D44(scratch.f0, scratch.f1, scratch.i2, *(s32 *)0x8018F58C, 0x28);
                *(u8 *)0x8021AC2C = 0U;
                var_v0_168 = *(u32 *)0x80214F64 + 1;
                goto block_103;
            }
        } else {
            if (*(u8 *)0x8021AFE9 == 0) {
                if (*(u8 *)0x80214E84 != 0) {
                    return;
                }
                goto block_16;
            }
            temp_v1_215 = *(void **)0x801F0CA0;
            temp_a0_216 = **(u16 **)0x800C4BDC;
            if (((*(u16 *)((s8 *)(temp_v1_215) + (0))) & temp_a0_216) || ((*(u16 *)((s8 *)(temp_v1_215) + (2))) & temp_a0_216)) {
block_16:
                func_0017C384(*(void **)0x801ED56C);
                *(s32 *)0x801ED540 = -1;
                func_00218C28();
                *(u8 *)0x8021AC2C = 1U;
                return;
            }
        }
        break;
    case 0x3:
        temp_a1_239 = *(s32 *)0x801F1070;
        var_a0_241 = 0;
        if (temp_a1_239 > 0) {
            var_v1_242 = 0;
loop_19:
            if (!((*(u16 *)((s8 *)((var_v1_242 + 0x80190000)) + (0x51CC))) & 0x10)) {
                var_a0_241 += 1;
                var_v1_242 += 0x24;
                if (var_a0_241 < temp_a1_239) {
                    goto loop_19;
                }
            }
        }
        func_001DC95C(var_a0_241 & 0xFFFF, temp_a1_239);
        scratch.a0 = 0x80193BF8;
        scratch.a1 = *(s32 *)0x8018F504;
        scratch.a2 = *(s32 *)0x8018F508;
        func_001E00F0(0x28, scratch.a0, scratch.a1, scratch.a2, 2, 0x17);
        var_v0_168 = *(u32 *)0x80214F64 + 1;
        goto block_103;
    case 0x4:
        if (*(u8 *)0x80214E84 == 0) {
            func_0017C384(*(void **)0x801ED56C);
            *(s32 *)0x801ED540 = -1;
            func_00218C28();
            var_v0_168 = *(u32 *)0x80214F64 + 1;
            goto block_103;
        }
        break;
    case 0x5:
        if (func_00218C3C() == 1) {
            if (*(u8 *)0x801F0E0C == 0xFF) {
                if (*(u8 *)0x8018F481 == 4) {
                    scratch.a0 = *(s32 *)0x8018F500;
                    scratch.a1 = *(s32 *)0x8018F504;
                    scratch.a2 = *(s32 *)0x8018F508;
                    func_001E00F0(0x74, scratch.a0, scratch.a1, scratch.a2, 2, 0x78);
                    var_v0_326 = *(u32 *)0x80214F64 + 1;
                } else {
                    var_v0_326 = *(u32 *)0x80214F64 + 2;
                }
            } else {
                scratch.a0 = *(s32 *)0x8018F500;
                scratch.a1 = *(s32 *)0x8018F504;
                scratch.a2 = *(s32 *)0x8018F508;
                func_001E00F0(0x29, scratch.a0, scratch.a1, scratch.a2, 2, 0x78);
                var_v0_326 = *(u32 *)0x80214F64 + 1;
            }
            *(u32 *)0x80214F64 = var_v0_326;
        }
                         
    case 0x6:
        if (*(s32 *)0x801ED540 != -1) {
            temp_a0_369 = *(void **)0x801ED56C;
            if (((*(u16 *)((s8 *)(temp_a0_369) + (0x26))) == 0) && ((temp_v1_376 = *(void **)0x801F0CA0, temp_a1_377 = **(u16 **)0x800C4BDC, (((*(u16 *)((s8 *)(temp_v1_376) + (0))) & temp_a1_377) != 0)) || ((*(u16 *)((s8 *)(temp_v1_376) + (2))) & temp_a1_377))) {
                func_0017C384(temp_a0_369, temp_a1_377);
                *(s32 *)0x801ED540 = -1;
                if (*(u8 *)0x8018F481 == 4) {
                    var_v0_168 = *(u32 *)0x80214F64 + 1;
                    goto block_103;
                }
                *(u32 *)0x80214F64 = 0x14U;
                *(u8 *)0x8021AFE8 = 0xF;
                return;
            }
        }
        break;
    case 0x14:
        temp_v0_409 = *(u8 *)0x8021AFE8 - 1;
        *(u8 *)0x8021AFE8 = temp_v0_409;
        if (!(temp_v0_409 & 0xFF)) {
            scratch.a0 = *(s32 *)0x8018F500;
            scratch.a1 = *(s32 *)0x8018F504;
            scratch.a2 = *(s32 *)0x8018F508;
            func_001E00F0(0x31, scratch.a0, scratch.a1, scratch.a2, 1, 0x64);
            func_0020CDA0(9);
            var_v0_168 = *(u32 *)0x80214F64 + 1;
            goto block_103;
        }
        break;
    case 0x15:
        if (*(s32 *)0x801ED540 != -1) {
            temp_a0_447 = *(void **)0x801ED56C;
            if (((*(u16 *)((s8 *)(temp_a0_447) + (0x26))) == 0) && ((temp_v1_454 = *(void **)0x801F0CA0, temp_a1_455 = **(u16 **)0x800C4BDC, (((*(u16 *)((s8 *)(temp_v1_454) + (0))) & temp_a1_455) != 0)) || ((*(u16 *)((s8 *)(temp_v1_454) + (2))) & temp_a1_455))) {
                func_0017C384(temp_a0_447, temp_a1_455);
                *(s32 *)0x801ED540 = -1;
                *(u8 *)0x8021AFE8 = 0U;
                var_v0_168 = 7;
                goto block_103;
            }
        }
        break;
    case 0x7:
        temp_v1_474 = *(u8 *)0x8021AFE7;
        if (temp_v1_474 >= 5U) {
            *(u8 *)0x8021AFE7 = (u8) (temp_v1_474 - 5);
            return;
        }
        *(u8 *)0x8021AFE7 = 0U;
        *(u8 *)0x8021AC18 = 0;
        *(u32 *)0x80214F64 = (u32) (*(u32 *)0x80214F64 + 1);
        var_v0_168 = 9;
        if (*(u8 *)0x8021AFEA != 0) {
            goto block_103;
        }
        break;
    case 0x8:
        *(s32 *)0x8021AC28 = 0;
        if (*(u8 *)0x8021AC18 == 0) {
            temp_v1_504 = *(u8 *)0x8021AFE8;
            var_v0_507 = temp_v1_504 + 5;
            if (temp_v1_504 >= 0xFBU) {
                var_v0_507 = 0xFF;
            }
            *(u8 *)0x8021AFE8 = var_v0_507;
            if (*(u8 *)0x8021AFE8 == 0xFF) {
                *(u8 *)0x8021AC18 = 1U;
            }
        }
        temp_v1_523 = *(s32 *)0x8021AFDC;
        temp_v0_524 = *(s32 *)0x8018F548 + temp_v1_523;
        *(s32 *)0x8018F548 = temp_v0_524;
        if (temp_v1_523 >= 0) {
            if (temp_v0_524 < *(s32 *)0x8021AFD0) {

            } else {
                goto block_60;
            }
        } else if (temp_v0_524 < *(s32 *)0x8021AFD0) {
block_60:
            *(s32 *)0x8018F548 = *(s32 *)0x8021AFD0;
            *(s32 *)0x8021AC28 = (s32) (*(s32 *)0x8021AC28 + 1);
        }
        temp_v1_553 = *(s32 *)0x8021AFE0;
        temp_v0_554 = *(s32 *)0x8018F54C + temp_v1_553;
        *(s32 *)0x8018F54C = temp_v0_554;
        if (temp_v1_553 >= 0) {
            if (temp_v0_554 < *(s32 *)0x8021AFD4) {

            } else {
                goto block_65;
            }
        } else if (temp_v0_554 < *(s32 *)0x8021AFD4) {
block_65:
            *(s32 *)0x8018F54C = *(s32 *)0x8021AFD4;
            *(s32 *)0x8021AC28 = (s32) (*(s32 *)0x8021AC28 + 1);
        }
        temp_v0_583 = *(u8 *)0x8021AFE4;
        temp_v1_584 = *(u8 *)0x8018F550 + temp_v0_583;
        *(u8 *)0x8018F550 = temp_v1_584;
        temp_v0_589 = temp_v1_584 & 0xFF;
        if (!(temp_v0_583 & 0x80)) {
            if (temp_v0_589 < (u8) *(u8 *)0x8021AFD8) {

            } else {
                goto block_70;
            }
        } else if (temp_v0_589 < (u8) *(u8 *)0x8021AFD8) {
block_70:
            *(u8 *)0x8018F550 = *(u8 *)0x8021AFD8;
            *(s32 *)0x8021AC28 = (s32) (*(s32 *)0x8021AC28 + 1);
        }
        temp_v0_615 = *(u8 *)0x8021AFE5;
        temp_v1_616 = *(u8 *)0x8018F551 + temp_v0_615;
        *(u8 *)0x8018F551 = temp_v1_616;
        temp_v0_621 = temp_v1_616 & 0xFF;
        if (!(temp_v0_615 & 0x80)) {
            if (temp_v0_621 < (u8) *(u8 *)0x8021AFD9) {

            } else {
                goto block_75;
            }
        } else if (temp_v0_621 < (u8) *(u8 *)0x8021AFD9) {
block_75:
            *(u8 *)0x8018F551 = *(u8 *)0x8021AFD9;
            *(s32 *)0x8021AC28 = (s32) (*(s32 *)0x8021AC28 + 1);
        }
        temp_v0_647 = *(u8 *)0x8021AFE6;
        temp_v1_648 = *(u8 *)0x8018F552 + temp_v0_647;
        *(u8 *)0x8018F552 = temp_v1_648;
        temp_v0_653 = temp_v1_648 & 0xFF;
        if (!(temp_v0_647 & 0x80)) {
            if (temp_v0_653 < (u8) *(u8 *)0x8021AFDA) {

            } else {
                goto block_80;
            }
        } else if (temp_v0_653 < (u8) *(u8 *)0x8021AFDA) {
block_80:
            *(u8 *)0x8018F552 = *(u8 *)0x8021AFDA;
            *(s32 *)0x8021AC28 = (s32) (*(s32 *)0x8021AC28 + 1);
        }
        if ((*(s32 *)0x8021AC28 >= 5) && (*(u8 *)0x8021AC18 == 1)) {
            var_v0_168 = *(u32 *)0x80214F64 + 1;
            goto block_103;
        }
        break;
    case 0x9:
        temp_v1_691 = *(u8 *)0x8021AFE8;
        if (temp_v1_691 >= 5U) {
            *(u8 *)0x8021AFE8 = (u8) (temp_v1_691 - 5);
        } else {
            *(u8 *)0x8021AFE8 = 0U;
        }
        if (*(u8 *)0x8021AFE8 == 0) {
            *(u8 *)0x8021AC18 = 0U;
        }
        if (*(u8 *)0x8021AC18 == 0) {
            func_00079618(0x0218E9B4, 0x19, -0x14, 1);
            func_00079618(0x0218E9B4, 0x19, -0x14, 4);
            *(u32 *)0x80214F64 = 0U;
            *(s32 *)0x801F0DE0 = 0;
            *(s32 *)0x801F0DE8 = 0;
            *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D & 0xFE);
            if ((func_00186210(0x22) == 0) && (func_001DC054() == 0)) {
                *(s32 *)0x801F0DE0 = 0x2F;
                *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D | 1);
                temp_v0_766 = func_0017F010(*(s32 *)0x8021AC24, 0x100, 0x98, 0x52, 0xA8, 0x62, 0x27, 0x46, 0x119, 0x8C);
                *(void **)0x8021AC20 = temp_v0_766;
                (*(s8 *)((s8 *)(*(void **)((s8 *)temp_v0_766 + 0xD0)) + 0x5F4)) = 4;
                (*(s32 *)((s8 *)(*(void **)((s8 *)(*(void **)0x8021AC20) + 0xD0)) + 0x600)) = 0x10000;
                func_00186190(0x22, 1);
            }
            if (*(u8 *)0x8021AFEA != 0) {
                *(s32 *)0x801F0DE0 = 3;
                *(s32 *)0x801F3658 = -1;
                *(s32 *)0x801F0DE8 = 0;
                *(u8 *)0x801F0FE0 = 4;
                *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D | 1);
                if (func_001DCF20() != 0) {
                    *(u8 *)0x801F0FE0 = (u8) (*(u8 *)0x801F0FE0 + 1);
                }
            }
            if ((*(u8 *)0x8018F481 == 2) && (func_00186210(0) != 0) && (*(u8 *)0x8021AFEB == 0)) {
                func_001DA340(7, &scratch.f0);
                func_001B8D44(scratch.f0, scratch.f1, scratch.i2, *(s32 *)0x8018F58C, 0x28);
                var_v0_168 = 0xA;
                goto block_103;
            }
        }
        break;
    case 0xA:
        *(s32 *)0x801F0DE0 = 0;
        *(s32 *)0x801F0DE8 = 0;
        *(u32 *)0x80214F64 = 0U;
        *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D & 0xFE);
        return;
    case 0x66:
        if (func_00218C3C() == 2) {
            var_v0_168 = *(u32 *)0x80214F64 - 0x64;
            goto block_103;
        }
        break;
    }
}
