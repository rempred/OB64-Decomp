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
s32 func_0002e138(M2C_UNK);                                     
s32 func_000415fc(s32);                                         
M2C_UNK func_000ae30c();             
M2C_UNK func_000b1f24(M2C_UNK, M2C_UNK, void *, u16);             
M2C_UNK func_000b1f4c(M2C_UNK, M2C_UNK, M2C_UNK);               
M2C_UNK func_000b4700(s16 *, u16 *, s16 *, u16 *);              
M2C_UNK func_000b47fc(s16, s16, s16, s16, s16 *, s16 *, s16 *, s16 *);             
M2C_UNK func_000b4a50();                    
M2C_UNK func_000b4bb8();                                        
M2C_UNK func_000b8300(s32);                                     
M2C_UNK func_000b8a94();                                        
M2C_UNK func_000b8d70();                                        
void *func_000b8e70();                           
M2C_UNK func_000b8f6c(void *);                                  
M2C_UNK func_000b9014(void *, s16, s16, s16, s32);              
M2C_UNK func_000b904c(void *, s16, s16, s16, s32, s32, s32, s32, s32);             
M2C_UNK func_000b9234();                   
M2C_UNK func_000b93d4(M2C_UNK, M2C_UNK, M2C_UNK, M2C_UNK, s32, s32, s32, s32, s32, s32, s32);             
s32 func_000ba8a8(s32);                                         
s32 func_000ba918(s32);                                         
s32 func_000bb3d8(M2C_UNK, s32, s32);                           
s16 func_000bb47c(M2C_UNK, s32, s32);                           
M2C_UNK func_000bc684();                                        
M2C_UNK func_000bc984(u16);                                     
M2C_UNK func_000bcee4(s32);                                     
s8 func_000bd154(s32);                                          
s8 func_000bd26c(s32);                                          
s8 func_000bd318(s32);                                          
s32 func_000bedb8();                              
M2C_UNK func_000bf248();                                        
M2C_UNK func_000bf458();                                        
s32 func_000bf9c8(u8, u8);                                      
M2C_UNK func_000bfc68(void *, f32, f32);                
s32 func_000bfebc();                                            
s32 func_000c01dc();                  
M2C_UNK func_000c0a30(M2C_UNK, M2C_UNK, M2C_UNK);               
M2C_UNK func_000c4a40();                
M2C_UNK func_000c54c0();               
M2C_UNK func_000c6bec(u8, M2C_UNK);                             
M2C_UNK func_000c6e38(u16);                                     
s32 func_000c91a0(s32);                                         
M2C_UNK func_000cc460();                                        
M2C_UNK func_000cf62c(u8);                                      
M2C_UNK func_000d0150(s32);                                     
M2C_UNK func_800EA604(M2C_UNK, M2C_UNK);                        
M2C_UNK func_801CD860(M2C_UNK, M2C_UNK, void *);                
s32 resource_alloc(M2C_UNK);                                    
M2C_UNK resource_free(s32);                                     
extern void * volatile D_80196AF8;
typedef s16 (*ClassCallback)(u8, u8);
extern u8 D_80196B00[];
extern ClassCallback D_801EF288[];

void func_000cddf0(void) {
    s16 sp30;
    u16 sp32;
    s16 sp34;
    u16 sp36;
    s16 sp38;
    s16 sp3A;
    s16 sp3C;
    s16 sp3E;
    s16 sp40;
    u16 sp42;
    s16 sp44;
    u16 sp46;
    M2C_UNK var_a0_287;
    M2C_UNK var_a1_289;
    s16 (**var_s2_1396)(u8, u8);
    s16 temp_v0_1402;
    s16 temp_v0_1550;
    s16 temp_v0_426;
    s16 temp_v1_1690;
    s16 temp_v1_170;
    s16 temp_v1_423;
    s16 temp_v1_625;
    s16 temp_v1_714;
    s16 var_v0_874;
    s32 temp_a0_1181;
    s32 temp_a0_1191;
    s32 temp_a0_1320;
    s32 temp_a0_1341;
    s32 temp_a0_1405;
    s32 temp_a0_1447;
    s32 temp_a0_264;
    s32 temp_a0_752;
    s32 temp_s0_1484;
    s32 temp_s0_1549;
    s32 temp_s0_1605;
    s32 temp_s1_1456;
    s32 temp_s1_1604;
    s32 temp_s1_1625;
    s32 temp_s2_1317;
    s32 temp_v0_1009;
    s32 temp_v0_1073;
    s32 temp_v0_1326;
    s32 temp_v0_1347;
    s32 temp_v0_1411;
    s32 temp_v0_1414;
    s32 temp_v0_1418;
    s32 temp_v0_305;
    s32 temp_v0_756;
    s32 temp_v0_879;
    s32 temp_v1_1154;
    s32 temp_v1_1242;
    s32 temp_v1_1554;
    s32 temp_v1_1594;
    s32 temp_v1_728;
    s32 var_a0_1184;
    s32 var_a0_173;
    s32 var_a0_390;
    s32 var_a0_776;
    s32 var_a0_871;
    s32 var_s1_1142;
    s32 var_s1_1235;
    s32 var_s1_1300;
    s32 var_s1_1391;
    s32 var_s1_1526;
    s32 var_s1_1544;
    s32 var_s1_303;
    s32 var_s1_735;
    s32 var_v0_1194;
    s32 var_v0_1413;
    s32 var_v0_354;
    s32 var_v1_1527;
    s8 temp_s0_1462;
    s8 temp_v0_1471;
    u16 temp_a0_1561;
    u16 temp_a0_841;
    u16 temp_a1_1178;
    u16 temp_a1_260;
    u16 temp_a1_459;
    u16 temp_a1_680;
    u16 temp_a1_770;
    u16 temp_a1_982;
    u16 temp_a3_258;
    u16 temp_a3_461;
    u16 temp_v1_1373;
    u16 var_v0_1123;
    u16 var_v0_707;
    u8 temp_a0_1358;
    u8 temp_a0_1400;
    u8 temp_a0_827;
    u8 temp_a1_1368;
    u8 temp_a1_1427;
    u8 temp_a2_460;
    u8 temp_s0_851;
    u8 temp_s1_715;
    u8 temp_s3_1305;
    u8 temp_s3_713;
    u8 temp_s3_748;
    u8 temp_v0_1431;
    u8 temp_v0_785;
    u8 temp_v1_330;
    u8 temp_v1_356;
    u8 temp_v1_824;
    u8 var_a1_828;
    void *temp_a0_1122;
    void *temp_a0_1166;
    void *temp_a0_1177;
    void *temp_a0_1211;
    void *temp_a0_1221;
    void *temp_a0_1280;
    void *temp_a0_1419;
    void *temp_a0_1426;
    void *temp_a0_1553;
    void *temp_a0_1589;
    void *temp_a0_556;
    void *temp_a0_566;
    void *temp_a0_613;
    void *temp_a0_653;
    void *temp_a1_1215;
    void *temp_a1_560;
    void *temp_a2_200;
    void *temp_a2_257;
    void *temp_a2_624;
    void *temp_a2_840;
    void *temp_a3_1036;
    void *temp_a3_1689;
    void *temp_s0_1313;
    void *temp_s0_1635;
    void *temp_s0_268;
    void *temp_s0_716;
    void *temp_s0_757;
    void *temp_s2_1472;
    void *temp_v0_1027;
    void *temp_v0_1156;
    void *temp_v0_1244;
    void *temp_v0_1542;
    void *temp_v0_1729;
    void *temp_v0_409;
    void *temp_v0_456;
    void *temp_v0_712;
    void *temp_v0_769;
    void *temp_v1_1004;
    void *temp_v1_1014;
    void *temp_v1_1065;
    void *temp_v1_1089;
    void *temp_v1_1146;
    void *temp_v1_1180;
    void *temp_v1_1500;
    void *temp_v1_1575;
    void *temp_v1_1585;
    void *temp_v1_1642;
    void *temp_v1_1665;
    void *temp_v1_1718;
    void *temp_v1_1780;
    void *temp_v1_1792;
    void *temp_v1_215;
    void *temp_v1_229;
    void *temp_v1_245;
    void *temp_v1_321;
    void *temp_v1_399;
    void *temp_v1_606;
    void *temp_v1_658;
    void *temp_v1_706;
    void *temp_v1_981;

    temp_v1_170 = (*(s16 *)((s8 *)(D_80196AF8) + (0x122)));
    var_a0_173 = 0;
    switch (temp_v1_170) {                                        
    case 0x0:                                                     
        (*(s32 *)((s8 *)(D_80196AF8) + (0x64))) = func_0002e138(0x01DCBFC2);
        (*(s32 *)((s8 *)(D_80196AF8) + (0x80))) = func_0002e138(0x01E39C4E);
        (*(s32 *)((s8 *)(D_80196AF8) + (0x1ED0))) = resource_alloc(0x210);
        func_000cc460();
        temp_a2_200 = D_80196AF8;
        (*(u8 *)((s8 *)(temp_a2_200) + (0x14D))) = 1U;
        (*(s16 *)((s8 *)(temp_a2_200) + (0x136))) = 0xE;
        (*(u16 *)((s8 *)(D_80196AF8) + (0x130))) = 0xEU;
        func_801CD860(0, 2, temp_a2_200);
        (*(s8 *)((s8 *)(D_80196AF8) + (0x60C))) = 1;
        temp_v1_215 = D_80196AF8;
        (*(s16 *)((s8 *)(temp_v1_215) + (0x122))) = (s16) ((u16) (*(s16 *)((s8 *)(temp_v1_215) + (0x122))) + 1);
        func_000b4a50(0x50018, 1);
        return;
    case 0x1:                                                     
        temp_v1_229 = D_80196AF8;
        (*(s32 *)((s8 *)(temp_v1_229) + (0x10AC))) = 0x309;
        (*(s16 *)((s8 *)(temp_v1_229) + (0x10C4))) = 1;
        (*(s8 *)((s8 *)(temp_v1_229) + (0x10A9))) = 8;
        func_000c0a30(0, 0x1F7, 6);
        func_000b1f4c(0, 0, 2);
        func_000b8a94();
        temp_v1_245 = D_80196AF8;
        (*(s16 *)((s8 *)(temp_v1_245) + (0x122))) = (s16) ((u16) (*(s16 *)((s8 *)(temp_v1_245) + (0x122))) + 1);
        func_000ae30c(0xA, 0, 0);
        return;
    case 0x2:                                                     
        temp_a2_257 = D_80196AF8;
        temp_a3_258 = (*(u16 *)((s8 *)(temp_a2_257) + (0x18A)));
        temp_a1_260 = *(u16 *)0x800E8100;
        temp_a0_264 = temp_a3_258 & 0xFF;
        temp_s0_268 = (temp_a0_264 * 0x38) + 0x80193BC0;
        if (temp_a1_260 & 0x1000) {
            if ((s16) temp_a3_258 == 0xFF) {
                func_000c54c0(7, temp_a1_260, temp_a2_257, temp_a3_258);
                return;
            }
            *(s8 *)0x801939D4 = (s8) temp_a3_258;
            func_000c4a40(temp_a2_257 + 0x610, (*(u8 *)((s8 *)(temp_a2_257) + (0x98))) == 1, temp_a2_257, temp_a3_258);
            var_a0_287 = 0xD;
            var_a1_289 = 1;
block_121:
            func_000ae30c(var_a0_287, var_a1_289, 0);
            return;
        }
        if (temp_a1_260 & 0x4000) {
            func_000c54c0(1, temp_a1_260, temp_a2_257, temp_a3_258);
            (*(s16 *)((s8 *)(D_80196AF8) + (0x122))) = 0x63;
            return;
        }
        var_s1_303 = 0;
        if (temp_a1_260 & 0x8000) {
            temp_v0_305 = func_000c01dc(temp_a0_264, 0x1F7, 6, temp_a3_258);
            switch (temp_v0_305) {                                
            case -1:                                              
                (*(s8 *)((s8 *)(D_80196AF8) + (0x10A9))) = 0;
                temp_v1_321 = D_80196AF8;
                (*(s16 *)((s8 *)(temp_v1_321) + (0x10C4))) = 0;
                (*(s16 *)((s8 *)(temp_v1_321) + (0x122))) = 4;
            default:                                              
block_36:
                var_v0_354 = var_s1_303 & 0xFFFF;
                break;
            case 1:                                               
                var_s1_303 = 0x35;
                goto block_36;
            case 3:                                               
                temp_v1_330 = (*(u8 *)((s8 *)(temp_s0_268) + (0x12)));
                if ((u32) (temp_v1_330 - 0x24) < 3U) {
                    var_s1_303 = 0x37;
                    goto block_36;
                }
                if ((u32) (temp_v1_330 - 0x2A) < 0xEU) {
                    var_s1_303 = 0x37;
                    goto block_36;
                }
block_35:
                func_000c54c0(7);
                func_000c6bec((*(u8 *)((s8 *)(temp_s0_268) + (0x11))), 0);
                func_000b4a50(((*(u8 *)((s8 *)(temp_s0_268) + (0x11))) - 0x51) | 0x1E0000, 1);
                var_v0_354 = 0 & 0xFFFF;
                break;
            case 5:                                               
                var_s1_303 = 0x26;
                goto block_36;
            case 6:                                               
            case 7:                                               
                var_s1_303 = 0x6D;
                goto block_36;
            case 2:                                               
                var_s1_303 = 0x36;
                goto block_36;
            case 8:                                               
                func_000c54c0(7);
                var_v0_354 = 0 & 0xFFFF;
                break;
            case 9:                                               
                temp_v1_356 = (*(u8 *)((s8 *)(temp_s0_268) + (0x12)));
                if ((u32) (temp_v1_356 - 0x24) < 3U) {
                    var_s1_303 = 0x37;
                    goto block_36;
                }
                if ((u32) (temp_v1_356 - 0x2A) < 0xEU) {
                    var_s1_303 = 0x37;
                    goto block_36;
                }
                if ((u32) ((*(u8 *)((s8 *)(temp_s0_268) + (0x11))) - 0x51) >= 0x11U) {
                    var_s1_303 = 0x37;
                    goto block_36;
                }
                goto block_35;
            }
            if (var_v0_354 != 0) {
                var_a0_390 = var_v0_354 | 0x40000;
block_101:
                func_000b4a50(var_a0_390, 1);
                return;
            }
        default:                                                  
            return;
        }
        func_000b1f24(0, 0, temp_a2_257, temp_a3_258);
        return;
    case 0x3:                                                     
        temp_v1_399 = D_80196AF8;
        var_a0_173 = 1;
        (*(s16 *)((s8 *)(temp_v1_399) + (0x122))) = (s16) ((u16) (*(s16 *)((s8 *)(temp_v1_399) + (0x122))) + 1);
                         
    case 0x4:                                                     
        func_000d0150(var_a0_173 & 0xFF);
        func_000bf458();
        temp_v0_409 = func_000b8e70(0);
        func_000b8f6c(temp_v0_409);
        func_000b4700(&sp30, &sp32, &sp34, &sp36);
        temp_v1_423 = sp32 + 0xA8;
        temp_v0_426 = sp36 + 0xA8;
        sp36 = (u16) temp_v0_426;
        sp32 = (u16) temp_v1_423;
        func_000b47fc(sp30, temp_v1_423, sp34, temp_v0_426, &sp38, &sp3A, &sp3C, &sp3E);
        func_000b904c(temp_v0_409, sp38, sp3A, sp3C, (s32) sp3E, (s32) sp30, (s32) (s16) sp32, (s32) sp34, (s32) (s16) sp36);
        temp_v0_456 = D_80196AF8;
        (*(s32 *)((s8 *)(temp_v0_409) + (8))) = 0;
        temp_a1_459 = (*(u16 *)((s8 *)(temp_v0_456) + (0x134)));
        temp_a2_460 = (*(u8 *)((s8 *)(temp_v0_456) + (0x14D)));
        temp_a3_461 = (*(u16 *)((s8 *)(temp_v0_456) + (0x19A)));
        (*(u16 *)((s8 *)(temp_v0_456) + (0x13C))) = (u16) (*(u16 *)((s8 *)(temp_v0_456) + (0x13A)));
        (*(u16 *)((s8 *)(temp_v0_456) + (0x13E))) = temp_a1_459;
        (*(s16 *)((s8 *)(temp_v0_456) + (0x140))) = (s16) temp_a2_460;
        (*(u16 *)((s8 *)(temp_v0_456) + (0x1A2))) = temp_a3_461;
        (*(u16 *)((s8 *)(temp_v0_456) + (0x1A0))) = (u16) (*(u16 *)((s8 *)(temp_v0_456) + (0x198)));
        func_000b9234(0x11, temp_a1_459, temp_a2_460, temp_a3_461);
block_193:
        var_v0_707 = (u16) (*(s16 *)((s8 *)(D_80196AF8) + (0x122)));
block_194:
        (*(s16 *)((s8 *)(D_80196AF8) + (0x122))) = (s16) (var_v0_707 + 1);
        return;
    case 0x5:                                                     
        func_000b93d4(8, 0xA, 0x801B3010, 0x120, 0x18, 0x128, 0x20, 0xF4, 0x2E, 0x128, 0x6C);
        func_000b93d4(7, 0xA, 0x801B22BC, 0x120, 0x18, 0x128, 0x20, 0x98, 0x18, 0x128, 0x2E);
        func_000b93d4(9, 0xA, 0x801AD0BC, 0x120, 0x18, 0x128, 0x20, 0xE8, 0x6A, 0x128, 0x7E);
        func_000b93d4(0xA, 0xA, 0x801B3690, 0x120, 0x18, 0x128, 0x20, 0xD2, 0xA0, 0x128, 0xB4);
        func_000b93d4(0xB, 8, 0x801A5580, 0x10, 0x18, 0x20, 0x20, 0x10, 0x52, 0x58, 0xA2);
        temp_a0_556 = D_80196AF8;
        (*(s8 *)((s8 *)(temp_a0_556) + (0x1E3F))) = 0x80;
        temp_a1_560 = D_80196AF8;
        (*(s32 *)((s8 *)(temp_a0_556) + (0x1E30))) = 0x8019A45C;
        (*(s8 *)((s8 *)(temp_a1_560) + (0x1E4F))) = 0x80;
        temp_a0_566 = D_80196AF8;
        (*(s32 *)((s8 *)(temp_a1_560) + (0x1E40))) = 0x8019A460;
        (*(s8 *)((s8 *)(temp_a0_566) + (0x1E5F))) = 0x80;
        (*(s32 *)((s8 *)(temp_a0_566) + (0x1E50))) = 0x8019A464;
        (*(s8 *)((s8 *)(D_80196AF8) + (0x1E6F))) = 0;
        (*(s8 *)((s8 *)(D_80196AF8) + (0x1E7F))) = 0;
        (*(s8 *)((s8 *)(D_80196AF8) + (0x1E8F))) = 0;
        (*(s8 *)((s8 *)(D_80196AF8) + (0x1E9F))) = 0;
        (*(s8 *)((s8 *)(func_000b8e70(7, temp_a1_560)) + (0xF0))) = 7;
        (*(s8 *)((s8 *)(func_000b8e70(8)) + (0xF0))) = 7;
        (*(s8 *)((s8 *)(func_000b8e70(9)) + (0xF0))) = 0xD;
        (*(s8 *)((s8 *)(D_80196AF8) + (0x10A9))) = 0;
        (*(s16 *)((s8 *)(D_80196AF8) + (0x10C4))) = 0;
        func_000c54c0(0x16);
        temp_v1_606 = D_80196AF8;
        (*(u8 *)((s8 *)(temp_v1_606) + (0x5E5))) = 0U;
        temp_a0_613 = D_80196AF8;
        (*(u16 *)((s8 *)(temp_v1_606) + (0x130))) = (u16) ((*(u16 *)((s8 *)(temp_v1_606) + (0x130))) | 0x400);
        (*(f32 *)((s8 *)(temp_a0_613) + (0x24F8))) = 0.1f;
        (*(s16 *)((s8 *)(temp_a0_613) + (0x124))) = 0;
        (*(s16 *)((s8 *)(temp_a0_613) + (0x122))) = (s16) ((u16) (*(s16 *)((s8 *)(temp_a0_613) + (0x122))) + 1);
        return;
    case 0x6:                                                     
        temp_a2_624 = D_80196AF8;
        temp_v1_625 = (*(s16 *)((s8 *)(temp_a2_624) + (0x124)));
        switch (temp_v1_625) {                                               
        case 0:                                                   
            (0);
            (*(f32 *)((s8 *)(temp_a2_624) + (0x24F8))) = (f32) ((*(f32 *)((s8 *)(temp_a2_624) + (0x24F8))) * 1.19f);
            if ((0)) {
                (*(s8 *)((s8 *)(temp_a2_624) + (0x88))) = 2;
                temp_a0_653 = D_80196AF8;
                (*(f32 *)((s8 *)(temp_a2_624) + (0x24F8))) = 2.3f;
                (*(s8 *)((s8 *)(temp_a0_653) + (0x60A))) = 1;
                temp_v1_658 = D_80196AF8;
                (*(u16 *)((s8 *)(temp_a0_653) + (0x130))) = 0x500U;
                (*(u8 *)((s8 *)(temp_v1_658) + (0x5E5))) = (u8) ((*(u8 *)((s8 *)(temp_v1_658) + (0x5E5))) + 1);
            case 11:                                              
block_200:
block_201:
                (*(u16 *)((s8 *)(D_80196AF8) + (0x124))) = (u16) ((*(u16 *)((s8 *)(D_80196AF8) + (0x124))) + 1);
                return;
            }
            break;
        case 1:                                                   
            (*(f32 *)((s8 *)(temp_a2_624) + (0x24F8))) = (f32) ((*(f32 *)((s8 *)(temp_a2_624) + (0x24F8))) * 1.09f);
            if ((0)) {
                temp_a1_680 = (*(u16 *)((s8 *)(temp_a2_624) + (0x5E8)));
                (*(s32 *)((s8 *)(temp_a2_624) + (0x10AC))) = 0x309;
                (*(f32 *)((s8 *)(temp_a2_624) + (0x24F8))) = (f32) (0);
                (*(s16 *)((s8 *)(temp_a2_624) + (0x10C4))) = 1;
                if ((temp_a1_680 == (*(u8 *)((s8 *)(temp_a2_624) + (0x5EC)))) || !(func_000bedb8((*(u8 *)((s8 *)(temp_a2_624) + (0x18B))), temp_a1_680 & 0xFF, temp_a2_624) & 0xFF)) {
                    (*(s8 *)((s8 *)(D_80196AF8) + (0x10A8))) = 1;
                } else {
                    (*(s8 *)((s8 *)(D_80196AF8) + (0x10A8))) = 0;
                }
                temp_v1_706 = D_80196AF8;
                var_v0_707 = (u16) (*(s16 *)((s8 *)(temp_v1_706) + (0x122)));
                (*(s16 *)((s8 *)(temp_v1_706) + (0x124))) = 0;
                goto block_194;
            }
            break;
        }
        break;
    case 0x7:                                                     
        temp_v0_712 = D_80196AF8;
        temp_s3_713 = (*(u8 *)((s8 *)(temp_v0_712) + (0x18B)));
        temp_v1_714 = (*(s16 *)((s8 *)(temp_v0_712) + (0x124)));
        temp_s1_715 = (*(u8 *)((s8 *)(temp_v0_712) + (0x5E9)));
        temp_s0_716 = temp_v0_712 + 0x1E50;
        switch (temp_v1_714) {                                    
        case 0:                                                   
            temp_v1_728 = func_000c91a0(0) & 0xFFFF;
            switch (temp_v1_728) {                                           
            case 1:                                               
                var_s1_735 = 0;
                temp_s3_748 = (*(u8 *)((s8 *)(D_80196AF8) + (0x18B)));
                temp_a0_752 = temp_s3_748 & 0xFF;
                temp_s0_757 = (temp_a0_752 * 0x38) + 0x80193BC0;
                temp_v0_756 = func_000c01dc(temp_a0_752, 0x1F7, 6);
                switch (temp_v0_756) {                            
                case -1:                                          
                    temp_v0_769 = D_80196AF8;
                    temp_a1_770 = (*(u16 *)((s8 *)(temp_v0_769) + (0x5E8)));
                    if (temp_a1_770 != (*(u8 *)((s8 *)(temp_v0_769) + (0x5EC)))) {
                        if (!(func_000bedb8(temp_s3_748 & 0xFF, temp_a1_770 & 0xFF) & 0xFF)) {
                            temp_v0_785 = (*(u8 *)((s8 *)(D_80196AF8) + (0x5ED)));
                            switch (temp_v0_785) {                
                            case 1:                               
                                var_a0_776 = 0x40037;
                                break;
                            case 2:                               
                                var_a0_776 = 0x4006B;
                                break;
                            case 3:                               
                                var_a0_776 = 0x40005;
                                break;
                            case 4:                               
                                var_a0_776 = 0x4003B;
                                break;
                            case 5:                               
                                var_a0_776 = 0x4007B;
                                break;
                            default:                              
                                var_a0_776 = 0x40039;
                                break;
                            }
                            goto block_79;
                        }
                        temp_v1_824 = (*(u8 *)((s8 *)(temp_s0_757) + (0x11)));
                        temp_a0_827 = (*(u8 *)((s8 *)((temp_v1_824 + 0x801F0000)) + (-0xC48)));
                        var_a1_828 = (*(u8 *)((s8 *)(temp_s0_757) + (0x12)));
                        if ((temp_a0_827 != 0) && ((*(u8 *)((s8 *)(((temp_v1_824 * 0x48) + 0x80180000)) + (0x7C59))) == var_a1_828)) {
                            var_a1_828 = temp_a0_827;
                        }
                        temp_a2_840 = D_80196AF8;
                        temp_a0_841 = (*(u16 *)((s8 *)(temp_a2_840) + (0x5E8)));
                        if ((((temp_a0_841 == 0x26) | (temp_a0_841 == 0x2B)) != 0) || (temp_s0_851 = temp_s3_748 & 0xFF, (temp_a0_841 == 0x2C))) {
                            (*(s16 *)((s8 *)(temp_a2_840) + (0x124))) = (s16) ((u16) (*(s16 *)((s8 *)(temp_a2_840) + (0x124))) + 1);
                            func_000b4a50(0x4006C, 1, temp_a2_840);
                        } else {
                            if (!(func_000bedb8(temp_s0_851, var_a1_828, temp_a2_840) & 0xFF)) {
                                var_a0_871 = 0x4006C;
                                var_v0_874 = (u16) (*(s16 *)((s8 *)(D_80196AF8) + (0x124))) + 1;
                                goto block_90;
                            }
                            temp_v0_879 = func_000bf9c8(temp_s0_851, (*(u8 *)((s8 *)(D_80196AF8) + (0x5E9))));
                            if (temp_v0_879 != 0) {
                                var_a0_871 = 0x4003C;
                                *(s32 *)0x801939DC = temp_v0_879;
                                var_v0_874 = 2;
block_90:
                                (*(s16 *)((s8 *)(D_80196AF8) + (0x124))) = var_v0_874;
                                func_000b4a50(var_a0_871, 1);
                            } else {
                                (*(s16 *)((s8 *)(D_80196AF8) + (0x124))) = 3;
                            }
                        }
                    } else {
                        var_a0_776 = 0x40038;
block_79:
                        func_000b4a50(var_a0_776, 1);
                    }
                    break;
                case 1:                                           
                    var_s1_735 = 0x35;
                    break;
                case 5:                                           
                    var_s1_735 = 0x26;
                    break;
                case 2:                                           
                    var_s1_735 = 0x36;
                    break;
                case 8:                                           
                    func_000c54c0(7);
                    break;
                case 9:                                           
                    if ((u32) ((*(u8 *)((s8 *)(temp_s0_757) + (0x11))) - 0x51) < 0x11U) {
                    case 3:                                       
                        func_000c54c0(7);
                        func_000c6bec((*(u8 *)((s8 *)(temp_s0_757) + (0x11))), 0);
                        func_000b4a50(((*(u8 *)((s8 *)(temp_s0_757) + (0x11))) - 0x51) | 0x1E0000, 1);
                    } else {
                    case 6:                                       
                    case 7:                                       
                        var_s1_735 = 0x37;
                    }
                    break;
                }
                if (var_s1_735 != 0) {
                    var_a0_390 = var_s1_735 | 0x40000;
                    goto block_101;
                }
                break;
            case 2:                                               
                func_000c54c0(0x17);
                goto block_193;
            case 3:                                               
                (*(s8 *)((s8 *)(D_80196AF8) + (0x60D))) = 1;
                (*(u8 *)((s8 *)(D_80196AF8) + (0x98))) = 0U;
                func_000c4a40(D_80196AF8 + 0x610, 8);
                var_a0_287 = 0xD;
                var_a1_289 = 1;
                goto block_121;
            default:                                              
                if (temp_s1_715 != (*(u8 *)((s8 *)(D_80196AF8) + (0x5E9)))) {
                    func_000c54c0(0x2E2);
                    func_000cf62c((*(u8 *)((s8 *)(D_80196AF8) + (0x5E9))));
                    func_000bf458();
                    temp_v1_981 = D_80196AF8;
                    temp_a1_982 = (*(u16 *)((s8 *)(temp_v1_981) + (0x5E8)));
                    if (temp_a1_982 != (*(u8 *)((s8 *)(temp_v1_981) + (0x5EC)))) {
                        if (!(func_000bedb8(temp_s3_713 & 0xFF, temp_a1_982 & 0xFF) & 0xFF)) {
                            goto block_108;
                        }
                        (*(s8 *)((s8 *)(D_80196AF8) + (0x10A8))) = 0;
                        return;
                    }
block_108:
                    (*(s8 *)((s8 *)(D_80196AF8) + (0x10A8))) = 1;
                    return;
                }
                break;
            }
            break;
        case 1:                                                   
            temp_v1_1004 = D_80196AF8;
            if ((*(u8 *)((s8 *)(temp_v1_1004) + (0x9B))) != 0) {
                (*(s16 *)((s8 *)(temp_v1_1004) + (0x124))) = 0;
block_120:
                var_a0_287 = 0xA;
                var_a1_289 = 0;
                goto block_121;
            }
            temp_v0_1009 = func_000bf9c8((*(u8 *)((s8 *)(temp_v1_1004) + (0x18B))), (*(u8 *)((s8 *)(temp_v1_1004) + (0x5E9))));
            if (temp_v0_1009 != 0) {
                temp_v1_1014 = D_80196AF8;
                *(void **)0x801939DC = temp_v0_1009;
                (*(s16 *)((s8 *)(temp_v1_1014) + (0x124))) = (s16) ((u16) (*(s16 *)((s8 *)(temp_v1_1014) + (0x124))) + 1);
                func_000b4a50(0x4003C, 1);
                return;
            }
            temp_v0_1027 = D_80196AF8;
            (*(s16 *)((s8 *)(temp_v0_1027) + (0x124))) = 3;
            (*(u8 *)((s8 *)(temp_v0_1027) + (0xA0))) = (u8) ((*(u8 *)((s8 *)(temp_v0_1027) + (0xA0))) | 0x80);
            return;
        case 2:                                                   
            temp_a3_1036 = D_80196AF8;
            if ((*(u8 *)((s8 *)(temp_a3_1036) + (0x9B))) != 0) {
                (*(s16 *)((s8 *)(temp_a3_1036) + (0x124))) = 0;
                goto block_120;
            }
            (*(s16 *)((s8 *)(temp_a3_1036) + (0x124))) = (s16) ((u16) (*(s16 *)((s8 *)(temp_a3_1036) + (0x124))) + 1);
            (*(u8 *)((s8 *)(temp_a3_1036) + (0xA0))) = (u8) ((*(u8 *)((s8 *)(temp_a3_1036) + (0xA0))) | 0x80);
            func_000ae30c(0xA, 0, 0, temp_a3_1036);
            return;
        case 3:                                                   
            (*(s8 *)((s8 *)(D_80196AF8) + (0x10A9))) = 0;
            temp_v1_1065 = D_80196AF8;
            (*(u8 *)((s8 *)(temp_v1_1065) + (0xA0))) = (u8) ((*(u8 *)((s8 *)(temp_v1_1065) + (0xA0))) | 0x80);
            (*(s16 *)((s8 *)(temp_v1_1065) + (0x10C4))) = 0;
            temp_v0_1073 = func_000bf9c8(temp_s3_713 & 0xFF, (*(u8 *)((s8 *)(D_80196AF8) + (0x5E9))));
            if (temp_v0_1073 != 0) {
                *(s32 *)0x80196A6C -= temp_v0_1073;
            }
            func_000c54c0(0x277);
            temp_v1_1089 = D_80196AF8;
            (*(s8 *)((s8 *)(temp_v1_1089) + (0x1E5F))) = 0x80;
            (*(s32 *)((s8 *)(temp_v1_1089) + (0x1E50))) = 0x8019A46C;
            func_000bfc68(D_80196AF8 + 0x1ED4, 0x42340000, 0x432F0000);
            func_000bfc68(D_80196AF8 + 0x1EE8, 38.0f, 125.0f);
            func_000bfc68(D_80196AF8 + 0x1EFC, 41.0f, 125.0f);
            func_000bfc68(D_80196AF8 + 0x1F10, 0x42200000, 0x43070000);
            temp_a0_1122 = D_80196AF8;
            var_v0_1123 = (u16) (*(s16 *)((s8 *)(temp_a0_1122) + (0x124)));
            (*(u16 *)((s8 *)(temp_a0_1122) + (0x12E))) = 4U;
block_174:
            (*(s16 *)((s8 *)(D_80196AF8) + (0x124))) = (s16) (var_v0_1123 + 1);
            return;
        case 4:                                                   
            if ((*(u16 *)((s8 *)(D_80196AF8) + (0x12E))) == 0) {
                func_800EA604(0x800EB240, 0x275);
                goto block_200;
            }
            break;
        case 5:                                                   
            var_s1_1142 = 3;
            if ((*(u8 *)((s8 *)(temp_s0_716) + (0xA))) != 0) {
                temp_v1_1146 = D_80196AF8;
                (*(u16 *)((s8 *)(temp_v1_1146) + (0x12E))) = 0x14U;
                (*(s8 *)((s8 *)(temp_v1_1146) + (0x60C))) = 0;
loop_129:
                temp_v1_1154 = var_s1_1142 * 0x10;
                var_s1_1142 += 1;
                temp_v0_1156 = D_80196AF8 + temp_v1_1154;
                (*(s32 *)((s8 *)(temp_v0_1156) + (0x1E30))) = 0x8019A528;
                (*(s8 *)((s8 *)(temp_v0_1156) + (0x1E3F))) = 0x80;
                if (var_s1_1142 < 7) {
                    goto loop_129;
                }
                goto block_200;
            }
            break;
        case 6:                                                   
            temp_a0_1166 = D_80196AF8;
            if ((*(u16 *)((s8 *)(temp_a0_1166) + (0x12E))) == 0) {
                var_v0_1123 = (u16) (*(s16 *)((s8 *)(temp_a0_1166) + (0x124)));
                (*(u16 *)((s8 *)(temp_a0_1166) + (0x12E))) = 0xFU;
                goto block_174;
            }
            break;
        case 7:                                                   
            temp_a0_1177 = D_80196AF8;
            temp_a1_1178 = (*(u16 *)((s8 *)(temp_a0_1177) + (0x12E)));
            temp_v1_1180 = func_000b8e70(0xB);
            if (temp_a1_1178 != 0) {
                temp_a0_1181 = (*(s32 *)((s8 *)(temp_v1_1180) + (0xC)));
                if (!(temp_a1_1178 & 1)) {
                    var_a0_1184 = temp_a0_1181 - 2;
                } else {
                    var_a0_1184 = temp_a0_1181 + 2;
                }
                (*(s32 *)((s8 *)(temp_v1_1180) + (0xC))) = var_a0_1184;
                temp_a0_1191 = (*(s32 *)((s8 *)(temp_v1_1180) + (0x14)));
                var_v0_1194 = temp_a0_1191 + 2;
                if (!((*(u16 *)((s8 *)(D_80196AF8) + (0x12E))) & 1)) {
                    var_v0_1194 = temp_a0_1191 - 2;
                }
                (*(s32 *)((s8 *)(temp_v1_1180) + (0x14))) = var_v0_1194;
                return;
            }
            (*(s8 *)((s8 *)(temp_a0_1177) + (0x1E6F))) = 0;
            (*(s8 *)((s8 *)(D_80196AF8) + (0x1E7F))) = 0;
            (*(s8 *)((s8 *)(D_80196AF8) + (0x1E8F))) = 0;
            (*(s8 *)((s8 *)(D_80196AF8) + (0x1E9F))) = 0;
            temp_a0_1211 = D_80196AF8;
            (*(s8 *)((s8 *)(temp_a0_1211) + (0x1E3F))) = 0x80;
            temp_a1_1215 = D_80196AF8;
            (*(s32 *)((s8 *)(temp_a0_1211) + (0x1E30))) = 0x8019A4C4;
            (*(s8 *)((s8 *)(temp_a1_1215) + (0x1E4F))) = 0x80;
            temp_a0_1221 = D_80196AF8;
            (*(s32 *)((s8 *)(temp_a1_1215) + (0x1E40))) = 0x8019A4D0;
            (*(s8 *)((s8 *)(temp_a0_1221) + (0x1E5F))) = 0x80;
            (*(s32 *)((s8 *)(temp_a0_1221) + (0x1E50))) = 0x8019A4DC;
            goto block_201;
        case 8:                                                   
            var_s1_1235 = 3;
            if ((*(u8 *)((s8 *)(temp_s0_716) + (0xA))) != 0) {
                do {
                    temp_v1_1242 = var_s1_1235 * 0x10;
                    var_s1_1235 += 1;
                    temp_v0_1244 = D_80196AF8 + temp_v1_1242;
                    (*(s32 *)((s8 *)(temp_v0_1244) + (0x1E30))) = 0x8019A538;
                    (*(s8 *)((s8 *)(temp_v0_1244) + (0x1E3F))) = 0x80;
                } while (var_s1_1235 < 7);
                func_000bfc68(D_80196AF8 + 0x1ED4, 100.0f, 125.0f);
                func_000bfc68(D_80196AF8 + 0x1EE8, 81.0f, 100.0f);
                func_000bfc68(D_80196AF8 + 0x1EFC, 108.0f, 93.0f);
                func_000bfc68(D_80196AF8 + 0x1F10, 78.0f, 100.0f);
                temp_a0_1280 = D_80196AF8;
                var_v0_1123 = (u16) (*(s16 *)((s8 *)(temp_a0_1280) + (0x124)));
                (*(u16 *)((s8 *)(temp_a0_1280) + (0x12E))) = 3U;
                goto block_174;
            }
            break;
        case 9:                                                   
            if ((*(u16 *)((s8 *)(D_80196AF8) + (0x12E))) == 1) {
                func_800EA604(0x800EB290, 0x276);
            }
            var_s1_1300 = 0;
            if ((*(u8 *)((s8 *)(temp_s0_716) + (0xA))) == 2) {
                temp_s3_1305 = (*(u8 *)((s8 *)(D_80196AF8) + (0x18B)));
                temp_s0_1313 = (temp_s3_1305 * 0x38) + 0x80193BC0;
                do {
                    temp_s2_1317 = var_s1_1300 + 1;
                    temp_a0_1320 = func_000bb3d8(0, temp_s3_1305 & 0xFF, temp_s2_1317 & 0xFF) & 0xFFFF;
                    if (temp_a0_1320 != 0) {
                        temp_v0_1326 = (func_000415fc(temp_a0_1320) & 0xFFFF) * 4;
                        D_80196B00[temp_v0_1326 + 2] = (s8) (D_80196B00[temp_v0_1326 + 2] - 1);
                    }
                    temp_a0_1341 = D_801EF288[var_s1_1300]((*(u8 *)((s8 *)(temp_s0_1313) + (0x11))), (*(u8 *)((s8 *)(temp_s0_1313) + (0x12)))) & 0xFFFF;
                    var_s1_1300 = temp_s2_1317;
                    if (temp_a0_1341 != 0) {
                        temp_v0_1347 = (func_000415fc(temp_a0_1341) & 0xFFFF) * 4;
                        D_80196B00[temp_v0_1347 + 2] = (s8) (D_80196B00[temp_v0_1347 + 2] - 1);
                    }
                } while (var_s1_1300 < 4);
                temp_a0_1358 = (*(u8 *)((s8 *)(temp_s0_1313) + (0x11)));
                (*(s16 *)((s8 *)(temp_s0_1313) + (0x30))) = 0;
                (*(s16 *)((s8 *)(temp_s0_1313) + (0x2E))) = 0;
                (*(s16 *)((s8 *)(temp_s0_1313) + (0x2C))) = 0;
                (*(s16 *)((s8 *)(temp_s0_1313) + (0x2A))) = 0;
                temp_a1_1368 = (*(u8 *)((s8 *)(((temp_a0_1358 * 0x48) + 0x80180000)) + (0x7C59)));
                if (temp_a1_1368 != 0) {
                    temp_v1_1373 = (*(u16 *)((s8 *)(D_80196AF8) + (0x5E8)));
                    if (temp_v1_1373 != (*(u8 *)((s8 *)((temp_a0_1358 + 0x801F0000)) + (-0xC48)))) {
                        (*(u8 *)((s8 *)(temp_s0_1313) + (0x12))) = (u8) temp_v1_1373;
                    } else {
                        (*(u8 *)((s8 *)(temp_s0_1313) + (0x12))) = temp_a1_1368;
                    }
                } else {
                    (*(u8 *)((s8 *)(temp_s0_1313) + (0x11))) = (u8) (*(u16 *)((s8 *)(D_80196AF8) + (0x5E8)));
                    (*(u8 *)((s8 *)(temp_s0_1313) + (0x12))) = (u8) (*(u16 *)((s8 *)(D_80196AF8) + (0x5E8)));
                }
                var_s1_1391 = 0;
                var_s2_1396 = D_801EF288;
                do {
                    temp_a0_1400 = (*(u8 *)((s8 *)(D_80196AF8) + (0x5E9)));
                    temp_v0_1402 = (*var_s2_1396)(temp_a0_1400, temp_a0_1400);
                    temp_a0_1405 = temp_v0_1402 & 0xFFFF;
                    if (temp_a0_1405 != 0) {
                        temp_v0_1411 = func_000415fc(temp_a0_1405) & 0xFFFF;
                        var_v0_1413 = temp_v0_1411 * 4;
                        if (temp_v0_1411 == 0x1FF) {
                            temp_v0_1414 = func_000bfebc();
                            temp_v0_1418 = (temp_v0_1414 & 0xFFFF) * 4;
                            temp_a0_1419 = D_80196B00 + temp_v0_1418;
                            *(s16 *)(D_80196B00 + temp_v0_1418) = temp_v0_1402;
                            (*(s8 *)((s8 *)(temp_a0_1419) + (2))) = 0;
                            (*(s8 *)((s8 *)(temp_a0_1419) + (3))) = 0;
                            var_v0_1413 = (temp_v0_1414 & 0xFFFF) * 4;
                        }
                        temp_a0_1426 = D_80196B00 + var_v0_1413;
                        temp_a1_1427 = (*(u8 *)((s8 *)(temp_a0_1426) + (2)));
                        temp_v0_1431 = temp_a1_1427 + 1;
                        if (temp_a1_1427 < (u8) (*(u8 *)((s8 *)(temp_a0_1426) + (3)))) {
                            (*(u8 *)((s8 *)(temp_a0_1426) + (2))) = temp_v0_1431;
                        } else {
                            (*(u8 *)((s8 *)(temp_a0_1426) + (2))) = temp_v0_1431;
                            (*(u8 *)((s8 *)(temp_a0_1426) + (3))) = (u8) ((*(u8 *)((s8 *)(temp_a0_1426) + (3))) + 1);
                        }
                    }
                    var_s1_1391 += 1;
                    var_s2_1396 += 1;
                } while (var_s1_1391 < 4);
                temp_a0_1447 = temp_s3_1305 & 0xFF;
                if ((*(u8 *)((s8 *)((D_80196AF8 + (temp_a0_1447 * 2))) + (0x1872))) & 8) {
                    temp_s1_1456 = func_000ba8a8(temp_a0_1447) & 0xFF;
                    func_000bcee4(temp_s1_1456);
                    temp_s0_1462 = func_000bd154(temp_s1_1456);
                    temp_s2_1472 = D_80196AF8 + ((temp_s1_1456 * 0x36) + 0x117C);
                    temp_v0_1471 = func_000bd154(temp_s1_1456);
                    (*(s8 *)((s8 *)(temp_s2_1472) + (0x1D))) = temp_v0_1471;
                    if (((temp_s0_1462 & 0xFF) != (temp_v0_1471 & 0xFF)) && ((*(u8 *)((s8 *)(temp_s2_1472) + (1))) & 8)) {
                        temp_s0_1484 = func_000ba918(temp_s1_1456) & 0xFF;
                        (*(s8 *)((s8 *)((D_80196AF8 + (temp_s0_1484 * 0xE))) + (0x10DE))) = func_000bd26c(temp_s0_1484);
                    }
                }
                func_000bc684();
                func_000bf458();
                temp_v1_1500 = D_80196AF8;
                (*(s8 *)((s8 *)(temp_v1_1500) + (0x1E5F))) = 0x80;
                (*(s32 *)((s8 *)(temp_v1_1500) + (0x1E50))) = 0x8019A498;
                var_v0_1123 = (u16) (*(s16 *)((s8 *)(D_80196AF8) + (0x124)));
                goto block_174;
            }
            break;
        case 10:                                                  
            func_000c6e38((*(u16 *)((s8 *)(D_80196AF8) + (0x18A))));
            (*(s8 *)((s8 *)(D_80196AF8) + (0x60C))) = 1;
            goto block_200;
        case 12:                                                  
            var_s1_1526 = 0;
            if ((*(u8 *)((s8 *)(temp_s0_716) + (0xA))) != 0) {
                var_v1_1527 = 0x30;
                do {
                    (*(s8 *)((s8 *)((D_80196AF8 + var_v1_1527)) + (0x1E3F))) = 0;
                    var_s1_1526 += 1;
                    (*(s8 *)((s8 *)((D_80196AF8 + var_v1_1527)) + (0x1E3D))) = 0;
                    var_v1_1527 += 0x10;
                } while (var_s1_1526 < 4);
                temp_v0_1542 = D_80196AF8;
                var_s1_1544 = 0;
                (*(u8 *)((s8 *)(temp_v0_1542) + (0x5EC))) = (u8) (*(u16 *)((s8 *)(temp_v0_1542) + (0x5E8)));
                do {
                    temp_s0_1549 = var_s1_1544 + 1;
                    temp_v0_1550 = func_000bb47c(0, temp_s3_713 & 0xFF, temp_s0_1549 & 0xFF);
                    temp_a0_1553 = D_80196AF8;
                    temp_v1_1554 = var_s1_1544 * 2;
                    var_s1_1544 = temp_s0_1549;
                    (*(s16 *)((s8 *)((temp_a0_1553 + temp_v1_1554)) + (0x1BFE))) = temp_v0_1550;
                } while (var_s1_1544 < 4);
                temp_a0_1561 = (*(u16 *)((s8 *)(temp_a0_1553) + (0x5E8)));
                if ((((temp_a0_1561 == 0x26) | (temp_a0_1561 == 0x2B)) != 0) || (temp_a0_1561 == 0x2C)) {
                    func_000bc984(temp_a0_1561);
                    temp_v1_1575 = D_80196AF8;
                    (*(s16 *)((s8 *)(temp_v1_1575) + (0x122))) = (s16) ((u16) (*(s16 *)((s8 *)(temp_v1_1575) + (0x122))) + 1);
                    func_000c54c0(0x17);
                }
                func_000bf248();
                temp_v1_1585 = D_80196AF8;
                (*(s8 *)((s8 *)(temp_v1_1585) + (0x10A8))) = 1;
                temp_a0_1589 = D_80196AF8;
                (*(s32 *)((s8 *)(temp_v1_1585) + (0x10AC))) = 0x309;
                (*(s16 *)((s8 *)(temp_v1_1585) + (0x10C4))) = 1;
                temp_v1_1594 = temp_s3_713 & 0xFF;
                (*(s16 *)((s8 *)(temp_a0_1589) + (0x124))) = 0;
                if ((*(u8 *)((s8 *)((temp_a0_1589 + (temp_v1_1594 * 2))) + (0x1872))) & 8) {
                    temp_s1_1604 = func_000ba8a8(temp_v1_1594) & 0xFF;
                    temp_s0_1605 = temp_s1_1604 & 0xFFFF;
                    if (temp_s0_1605 != 0xFF) {
                        func_000b8300(temp_s0_1605);
                        if ((*(u8 *)((s8 *)((D_80196AF8 + (temp_s0_1605 * 0x36))) + (0x117D))) & 8) {
                            temp_s1_1625 = func_000ba918(temp_s1_1604) & 0xFF;
                            if (temp_s1_1625 != 0xFF) {
                                temp_s0_1635 = D_80196AF8 + ((temp_s1_1625 * 0xE) + 0x10D4);
                                (*(s8 *)((s8 *)(temp_s0_1635) + (0xA))) = func_000bd26c(temp_s1_1625);
                                (*(s8 *)((s8 *)(temp_s0_1635) + (0xB))) = func_000bd318(temp_s1_1625);
                            }
                        }
                    }
                }
                temp_v1_1642 = D_80196AF8;
                (*(u8 *)((s8 *)(temp_v1_1642) + (0xA0))) = (u8) ((*(u8 *)((s8 *)(temp_v1_1642) + (0xA0))) & 0x7F);
                return;
            }
            break;
        }
        break;
    case 0x8:                                                     
        func_000b9234(8);
        func_000b9234(7);
        func_000b9234(9);
        func_000b9234(0xA);
        func_000b9234(0xB);
        func_000b8d70();
        (*(u8 *)((s8 *)(D_80196AF8) + (0x5E5))) = 1U;
        temp_v1_1665 = D_80196AF8;
        (*(s16 *)((s8 *)(temp_v1_1665) + (0x124))) = 0;
        if ((*(s32 *)((s8 *)(temp_v1_1665) + (0x78))) == 0) {
            (*(s32 *)((s8 *)(temp_v1_1665) + (0x1BD4))) = 0x1F;
            (*(s16 *)((s8 *)(temp_v1_1665) + (0x122))) = 8;
            return;
        }
        func_000c0a30(0, 0x1F7, 6);
        goto block_193;
    case 0x9:                                                     
        temp_a3_1689 = D_80196AF8;
        temp_v1_1690 = (*(s16 *)((s8 *)(temp_a3_1689) + (0x124)));
        switch (temp_v1_1690) {                                              
        case 0:                                                   
            (*(f32 *)((s8 *)(temp_a3_1689) + (0x24F8))) = (f32) (0);
            if ((0)) {
                (*(s8 *)((s8 *)(temp_a3_1689) + (0x88))) = 1;
                temp_v1_1718 = D_80196AF8;
                (*(u16 *)((s8 *)(temp_v1_1718) + (0x130))) = 0x40EU;
                (*(s32 *)((s8 *)(temp_v1_1718) + (0x10AC))) = 0x309;
                (*(s16 *)((s8 *)(temp_v1_1718) + (0x10C4))) = 1;
                (*(s8 *)((s8 *)(temp_v1_1718) + (0x10A9))) = 8;
                func_000b4700(&sp40, &sp42, &sp44, &sp46);
                temp_v0_1729 = func_000b8e70(0);
                func_000b904c(temp_v0_1729, (*(s16 *)((s8 *)(temp_v0_1729) + (0xE))), (*(s16 *)((s8 *)(temp_v0_1729) + (0x12))), (*(s16 *)((s8 *)(temp_v0_1729) + (0x16))), (s32) (*(s16 *)((s8 *)(temp_v0_1729) + (0x1A))), (s32) sp40, (s32) (s16) sp42, (s32) sp44, (s32) (s16) sp46);
                func_000b9014(temp_v0_1729, sp40, (s16) sp42, sp44, (s32) (s16) sp46);
                goto block_200;
            }
            break;
        case 1:                                                   
            (0);
            (*(f32 *)((s8 *)(temp_a3_1689) + (0x24F8))) = (f32) ((*(f32 *)((s8 *)(temp_a3_1689) + (0x24F8))) * 1.19f);
            if ((0)) {
                (*(s8 *)((s8 *)(temp_a3_1689) + (0x609))) = 0;
                temp_v1_1780 = D_80196AF8;
                (*(u16 *)((s8 *)(temp_a3_1689) + (0x130))) = (u16) ((*(u16 *)((s8 *)(temp_a3_1689) + (0x130))) & 0xFBFF);
                (*(s16 *)((s8 *)(temp_v1_1780) + (0x122))) = 2;
                (*(s32 *)((s8 *)(temp_v1_1780) + (0x10AC))) = 0x309;
                (*(s16 *)((s8 *)(temp_v1_1780) + (0x10C4))) = 1;
                return;
            }
            break;
        }
        break;
    case 0x63:                                                    
        temp_v1_1792 = D_80196AF8;
        (*(u16 *)((s8 *)(temp_v1_1792) + (0x130))) = (u16) ((*(u16 *)((s8 *)(temp_v1_1792) + (0x130))) & 0xFBFF);
        resource_free((*(s32 *)((s8 *)(temp_v1_1792) + (0x1ED0))));
        resource_free((*(s32 *)((s8 *)(D_80196AF8) + (0x80))));
        resource_free((*(s32 *)((s8 *)(D_80196AF8) + (0x64))));
        func_000b4bb8();
        break;
    }
}
