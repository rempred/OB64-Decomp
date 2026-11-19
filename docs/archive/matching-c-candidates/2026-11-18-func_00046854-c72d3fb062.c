typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

typedef s32 (*EventReadFn)(s32, s32);
typedef void (*EventWriteFn)(s32, s32, s32);
typedef void (*EventIndexedWriteFn)(u16, s16, u16);

struct EventInstruction {
    s8 opcode;
    s8 operand;
};

struct EventTimedRecord {
    u8 id;
    u8 field01;
    u16 field02;
    u8 field04;
    u8 field05;
};

struct EventFrame {
    u16 savedCursor[32];
    u16 words[8];
    struct EventInstruction instruction;
};

#define FIELD(base, type, offset) (*(type)((u8 *)(base) + (offset)))

extern volatile u16 D_80197B04;
extern u16 D_8018F1A0;
extern s32 D_80197B14;
extern u8 D_801936AA;
extern u8 D_801969B8[];
extern u8 D_80196AE9;
extern u8 D_80197B20[];
extern u32 D_80196A6C;
extern struct EventTimedRecord D_80197810[];

extern void func_00023780(void *, s32);
extern s32 rand(void);
extern void memmove_0002cc00(void *, const void *, u32);
extern void func_8016FE78(s32, s32);
extern u16 func_00046738(s32);
extern s32 func_0004890C(u8);
extern void func_00048928(s32, s32, u16, s32);
extern void func_00048fbc(u8, s32, u32);
extern void func_000490ec(void);
extern void func_000491e0(s16);
extern s32 func_000492a0(u16);
extern void func_000493D4(u16 *, u16 *, u8);
extern void func_0028a7b0(u8, s16, s32);
extern void func_0028a84c(u8, u8);
extern void func_0028a8b8(u8);

s32 func_00046854(s32 arg0) {
    struct EventFrame frame;
    u16 *stack;
    volatile u16 *cursor;
    volatile u8 *advance;
    u16 *request;
    u32 sentinel;
    EventWriteFn var_v0_850;
    EventReadFn var_v0_651;
    u16 temp_v0_195;
    s16 temp_v1_107;
    s32 var_a0_647;
    s32 var_a0_840;
    s32 var_a1_648;
    s32 var_v0_524;
    s32 temp_a0_1047;
    s32 temp_a0_634;
    s32 temp_a0_817;
    s32 temp_a0_946;
    s32 temp_a1_1046;
    s32 temp_a1_945;
    s32 temp_a2_671;
    s32 temp_a3_249;
    s32 temp_v0_112;
    s32 temp_v1_157;
    s32 var_s0_177;
    s32 var_s0_479;
    u16 var_s3_11;
    s32 var_v0_95;
    s32 var_v1_527;
    u16 *temp_a0_1011;
    u16 *temp_a0_1028;
    u16 *temp_a0_1118;
    u16 *temp_a0_958;
    u16 *temp_a0_968;
    u16 *temp_a0_978;
    u16 *temp_a0_988;
    u16 *temp_a0_998;
    u16 *temp_v0_936;
    u16 *temp_v1_1059;
    u16 *temp_v1_1066;
    u16 *temp_v1_1073;
    u16 *temp_v1_1080;
    u16 *temp_v1_1087;
    u16 *temp_v1_1097;
    u16 *temp_v1_636;
    u16 *temp_v1_819;
    s32 var_a2_844;
    u16 var_v1_92;
    u32 temp_v1_1048;
    u32 temp_v1_480;
    s16 temp_v1_855;
    u32 temp_v1_947;
    u8 *temp_v1_379;
    u8 temp_v0_446;
    u8 var_a0_448;
    struct EventTimedRecord *temp_s0_253;

    var_s3_11 = 0;
    stack = frame.savedCursor;
    for (;;) {
    request = &D_8018F1A0;
    cursor = &D_80197B04;
    advance = (volatile u8 *)cursor - 2;
    sentinel = 0xFF;
    frame.instruction = ((struct EventInstruction *)arg0)[*(s16 *)0x80197B04];
    switch ((u8) ((volatile struct EventInstruction *)&frame.instruction)->opcode) {
    case 0x3:
        stack[var_s3_11++] = *cursor;
        /* fallthrough */
    case 0x2:
        *cursor = (s16) ((u16) *cursor + (((u8 *)&frame.words[0])[1] + ((u8) frame.instruction.operand << 8)));
        goto block_196;
    case 0x4:
        *(u16 *)0x80197B04 = stack[--var_s3_11];
        goto block_196;
    case 0x5:
        stack[var_s3_11++] = FIELD(&stack[(u8)frame.instruction.operand & 7], u16 *, 0x40);
        goto block_196;
    case 0x6: {
        u8 operand = (u8)frame.instruction.operand;
        FIELD((u8 *)(((operand & 7) * 2) + (u32)stack), u16 *, 0x40) = stack[--var_s3_11];
        goto block_196;
    }
    case 0x10: {
        u16 scene = frame.words[0];
        request[1] = 0x8002;
        *advance = 1;
        request[0] = scene;
        temp_v1_107 = FIELD(((FIELD(advance, u8 *, -2) * 2) + 0x80190000), s16 *, -0xD08);
        FIELD(advance, s32 *, 0x12) = (s32) temp_v1_107;
        if (temp_v1_107 == 0x10) {
            request[0] = scene | 0x4000;
            temp_v0_112 = func_000492a0(scene);
            if (temp_v0_112 == 2) {
                goto check_scene_flags;
            }
            if (temp_v0_112 != 7) {
                FIELD(advance, s32 *, 0x12) |= 0x800;
            }
check_scene_flags:
            if ((u8) frame.instruction.operand & 0x80) {
                s32 *flags = &D_80197B14;
                *flags |= 0x400;
            }
        }
        {
            s32 *flags = &D_80197B14;
            *flags |= ((s32 *)0x8018F304)[(u8)frame.instruction.operand & 3];
        }
        if ((u8) frame.instruction.operand & 0x40) {
            request[0] = (u16) (request[0] & 0xBFFF);
        }
        return 1;
    }
    case 0x11:
        temp_v1_157 = ((u8 *)&frame.words[0])[1] + ((u8) frame.instruction.operand << 8);
        if (temp_v1_157 == 1) {
            *(u8 *)0x80197B01 = sentinel;
        case 0x2F:
            return 0;
        }
        request[0] = 0U;
        request[1] = func_00046738(temp_v1_157 & 0xFF);
        *(s32 *)0x80197B14 = 0;
        return 1;
    case 0x12: {
        u16 range = frame.words[0];
        var_s0_177 = range & 0xFF;
        goto test_range;
process_range:
        func_8016FE78(var_s0_177, 0);
        range = frame.words[0];
        var_s0_177++;
test_range:
        if (var_s0_177 < (s32)(range >> 8)) {
            goto process_range;
        }
        *(u8 *)0x801936A8 = (u8)frame.instruction.operand;
        return 2;
    }
    case 0x13:
        temp_v0_195 = func_00046738((u8) frame.instruction.operand);
        *(u16 *)0x8018F1A2 = temp_v0_195;
        if (temp_v0_195 & 0xFFFF) {
            *advance = 1;
            FIELD(advance, s32 *, 0x12) = 0;
            return 1;
        }
        goto block_196;
    case 0x15: {
        s16 index = 0;
        u8 id = (u8)frame.instruction.operand;
        u8 found;
        s32 value;

scan_records:
        found = FIELD(((s16)index * 6 + 0x80190000), u8 *, 0x7810);
        if (found == id) {
            goto after_scan;
        }
        index++;
        if (index < 121) {
            goto scan_records;
        }
after_scan:
        if (index < 121) {
            goto block_196;
        }

        index = 0;
        value = frame.words[2] + frame.words[1] * 40 + frame.words[0] * 600;
        do {
            temp_a3_249 = index;
            temp_s0_253 = &D_80197810[temp_a3_249];
            if (temp_s0_253->id == sentinel) {
                goto insert_record;
            }
            if (value < temp_s0_253->field05 + temp_s0_253->field04 * 40 + temp_s0_253->field02 * 600) {
                goto shift_records;
            }
            index++;
        } while (index < 121);
        goto block_196;
    }
    case 0x16: {
        u8 operand = (u8)frame.instruction.operand;
        u32 argument = operand & 0xFF;
        if (argument == 5) {
            func_00048928(0, 0, ((u8)func_0004890C(0) * 4) + 0x1AE, 1);
        } else if (argument == 6) {
            func_00048928(0, 0, ((u8)func_0004890C(1) * 4) + 0x1AF, 1);
        } else if (argument == 7) {
            func_00048928(0, 0, ((u8)func_0004890C(2) * 4) + 0x1B0, 1);
        } else if (argument == 8) {
            func_00048928(0, 0, ((u8)func_0004890C(3) * 4) + 0x1B1, 1);
        } else {
            func_00048928(argument >> 7, operand & 0x3F, frame.words[0], (argument >> 6) & 1);
        }
        goto block_196;
    }
    case 0x17:
        func_000491e0((s16) (((u8 *)&frame.words[0])[1] + ((u8) frame.instruction.operand << 8)));
        goto block_196;
    case 0x18:
        *(u8 *)0x801939D7 = (u8) frame.instruction.operand;
        goto block_196;
    case 0x19:
        *(u8 *)0x80196AEA = (u8) frame.instruction.operand;
        *(u8 *)0x80196AEB = (u8) frame.words[0];
        goto block_196;
    case 0x1A:
        *(u16 *)0x80196A9C = frame.words[0];
        *(s16 *)0x80196A9E = (s16) (u8) frame.instruction.operand;
        goto block_196;
    case 0x1B:
        *(s32 *)0x80193A8C = (s32)D_80197B20;
        temp_v1_379 = D_80197B20 + frame.words[7];
        frame.words[7] += 1;
        *temp_v1_379 = (u8) frame.instruction.operand;
        goto block_196;
    case 0x1C:
    case 0x1D:
        func_0028a7b0(((u8 *)&frame.words[0])[1], (s16) (((u8 *)&frame.words[1])[1] + ((u8) frame.instruction.operand << 8)), (u8) frame.instruction.opcode == 0x1C);
        goto block_196;
    case 0x1E:
        func_0028a84c(((u8 *)&frame.words[0])[1], (u8) frame.instruction.operand);
        goto block_196;
    case 0x1F:
        func_0028a8b8((u8) frame.instruction.operand);
        goto block_196;
    case 0x20:
        func_000490ec();
        goto block_196;
    case 0x21:
        if ((D_80196AE9 = (u8)frame.instruction.operand) == 0) {
            func_00023780(D_801969B8, 0x6E);
        }
        goto block_196;
    case 0x22:
        func_00048fbc((u8) frame.instruction.operand, frame.words[0] & 0xFF, frame.words[0] >> 8);
        goto block_196;
    case 0x28:
        func_000493D4(&frame.words[6], &frame.words[7], ((u8 *)&frame.words[5])[1]);
        goto block_196;
    case 0x29: {
        u8 *target = &D_801936AA;
        u32 masked = *(u8 *)0x80196A9A & 0x3F;
        u8 value = masked;
        if (*(u8 *)0x80196AEA == masked) {
            value = *(u8 *)0x80196AEB;
            *target = value;
        } else {
            *target = value;
        }
        goto block_196;
    }
    case 0x2D:
        if (*(u32 *)0x80196A6C < frame.words[0]) {
            goto block_195;
        }
        goto block_196;
    case 0x2E: {
        u32 *value = &D_80196A6C;
        s16 decrement = ((u8)frame.instruction.operand << 8) + ((u8 *)&frame.words[0])[1];
        *value -= decrement;
        goto block_196;
    }
    case 0x60:
    case 0x61:
    case 0x62:
    case 0x63:
    case 0x64:
    case 0x65:
    case 0x66:
    case 0x67: {
        u16 *words;
        u8 opcode = ((volatile struct EventInstruction *)&frame.instruction)->opcode;
        u8 operand = (u8)frame.instruction.operand;
        var_s0_479 = opcode & 7;
        temp_v1_480 = operand & 0xFF;
        if (temp_v1_480 >= 0xE5U) {
            switch (temp_v1_480) {
            case 0xE4:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x80197B62;
                goto block_196;
            case 0xE5:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x8022A999;
                goto block_196;
            case 0xE6:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = *(u16 *)0x80197B60;
                goto block_196;
            case 0xE7:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x8018F481;
                goto block_196;
            case 0xE8:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x801936A8;
                goto block_196;
            case 0xE9:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x801936A7;
                goto block_196;
            case 0xEA:
                FIELD(&stack[var_s0_479], u16 *, 0x40) = rand();
                goto block_196;
            case 0xEB:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x8023DF10;
                goto block_196;
            case 0xEC:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = *(u16 *)0x801936B0;
                goto block_196;
            case 0xED:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x801936AE;
                goto block_196;
            case 0xEE:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = *(u16 *)0x80193678;
                goto block_196;
            case 0xEF:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x8019367A;
                goto block_196;
            case 0xF0:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x8019367B;
                goto block_196;
            case 0xF1:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = *(u16 *)0x80196A72;
                goto block_196;
            case 0xF2:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x80196A74;
                goto block_196;
            case 0xF3:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x80196A75;
                goto block_196;
            case 0xF4:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = *(u16 *)0x80196A30;
                goto block_196;
            case 0xF5:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x80196A32;
                goto block_196;
            case 0xF6:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x80196A33;
                goto block_196;
            case 0xF8:
                FIELD(&stack[var_s0_479], s16 *, 0x40) = (s16) (*(u8 *)0x801976E8 + 1);
                break;
            case 0xF9:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x80196A9A;
                goto block_196;
            case 0xFA:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = *(u16 *)0x80197B08;
                goto block_196;
            case 0xFB:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x801976D8;
                goto block_196;
            case 0xFC:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x801976D9;
                goto block_196;
            case 0xFD:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x801976E8;
                goto block_196;
            case 0xFE:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x801976DC;
                goto block_196;
            case 0xFF:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x801936A9;
                goto block_196;
            default:
                break;
            }
            goto block_196;
        }
        words = frame.words;
        temp_v1_636 = &words[operand & 7];
        temp_a0_634 = operand & 0xF8;
        switch (temp_a0_634) {
        case 0:
            FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) FIELD(temp_v1_636, u8 *, 1);
            goto block_196;
        case 8:
            var_a0_647 = frame.words[7];
            var_a1_648 = (s16) FIELD(temp_v1_636, u16 *, 0);
            var_v0_651 = *(EventReadFn *)0x8018F1B4;
            goto block_146;
        default:
            var_a0_647 = (s16) FIELD(temp_v1_636, u16 *, 0);
            var_v0_651 = FIELD(((((u8) frame.instruction.operand >> 3) * 4) + 0x80190000), EventReadFn *, -0xE50);
            var_a1_648 = 0;
            goto block_146;
        }
        goto block_196;
    }
    case 0x68:
    case 0x69:
    case 0x6A:
    case 0x6B:
    case 0x6C:
    case 0x6D:
    case 0x6E:
    case 0x6F: {
        u16 result = (u8) frame.instruction.operand;
        FIELD(&stack[(u8)frame.instruction.opcode & 7], u16 *, 0x40) = result;
        goto block_196;
    }
    case 0x70:
    case 0x71:
    case 0x72:
    case 0x73:
    case 0x74:
    case 0x75:
    case 0x76:
    case 0x77: {
        u32 selector;
        u16 *words;
        u8 opcode = ((volatile struct EventInstruction *)&frame.instruction)->opcode;
        selector = (u8)((volatile struct EventInstruction *)&frame.instruction)->operand;
        temp_a2_671 = opcode & 7;
        if ((u8)selector >= 0xE4U) {
            switch ((u8)selector) {
        case 0xE4:
            *(u8 *)0x80197B62 = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xE5:
            *(u8 *)0x8022A999 = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xE6:
            *(u16 *)0x80197B60 = (u16) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xE7:
            *(u8 *)0x8018F481 = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xE8:
            *(u8 *)0x801936A8 = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xE9:
            *(u8 *)0x801936A7 = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xEB:
            *(u8 *)0x8023DF10 = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xEC:
            *(u16 *)0x801936B0 = (u16) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xED:
            *(u8 *)0x801936AE = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xEE:
            *(u16 *)0x80193678 = (u16) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xEF:
            *(u8 *)0x8019367A = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xF0:
            *(u8 *)0x8019367B = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xF9:
            *(u8 *)0x80196A9A = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xFA:
            *(u16 *)0x80197B08 = (u16) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xFB:
            *(u8 *)0x801976D8 = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xFD:
            *(u8 *)0x801976E8 = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xFE:
            *(u8 *)0x801976DC = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xFF:
            *(u8 *)0x801936A9 = (u8) FIELD(&stack[temp_a2_671], u16 *, 0x40);
            goto block_196;
        case 0xEA:
        case 0xF1:
        case 0xF2:
        case 0xF3:
        case 0xF4:
        case 0xF5:
        case 0xF6:
        case 0xF7:
        case 0xF8:
        case 0xFC:
        default:
loop_127:
            goto loop_127;
            }
        }
        words = frame.words;
        {
            u8 operand = frame.instruction.operand;
            temp_v1_819 = &words[operand & 7];
            temp_a0_817 = operand & 0xF8;
        }
            switch (temp_a0_817) {
            case 0:
loop_131:
                goto loop_131;
            case 8:
                (*(EventIndexedWriteFn *)0x8018F224)(frame.words[7], (s16) *temp_v1_819, FIELD(&stack[temp_a2_671], u16 *, 0x40));
                goto block_196;
            default:
            {
                s32 argument = *(s16 *)temp_v1_819;
                u32 selector = (u8)((volatile struct EventInstruction *)&frame.instruction)->operand;
                u32 value = FIELD(&stack[temp_a2_671], u16 *, 0x40);
                EventWriteFn write = ((EventWriteFn *)0x8018F220)[selector >> 3];
                write(argument, 0, value);
                goto block_196;
            }
            }
        goto block_196;
    }
    case 0x78:
    case 0x79:
    case 0x7A:
    case 0x7B:
    case 0x7C:
    case 0x7D:
    case 0x7E:
    case 0x7F:
        var_s0_479 = (u8) frame.instruction.opcode & 7;
        var_a1_648 = (u8)frame.instruction.operand;
        temp_v1_855 = var_a1_648 & 0xFF;
        if (temp_v1_855 >= 0xE5U) {
            if (temp_v1_855 == 0xFE) goto read_byte_6A2E;
            if ((s32)temp_v1_855 >= 0xFF) goto read_ff;
            if (temp_v1_855 == 0xFD) goto read_word_6A2C;
            goto block_196;
read_ff:
            if (temp_v1_855 == sentinel) goto read_byte_6A2F;
            goto block_196;
read_word_6A2C:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = *(u16 *)0x80196A2C;
                goto block_196;
read_byte_6A2E:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = (u16) *(u8 *)0x80196A2E;
                goto block_196;
read_byte_6A2F:
                FIELD((u8 *)((var_s0_479 * 2) + (u32)stack), u16 *, 0x40) = *(u8 *)0x80196A2F;
                goto block_196;
        } else {
            var_a0_647 = ((s16 *)frame.words)[var_a1_648 & 7];
            var_v0_651 = FIELD(((((u32)var_a1_648 >> 3) * 4) + 0x80190000), EventReadFn *, -0xD70);
            var_a1_648 = 0;
block_146:
            FIELD(&stack[var_s0_479], u16 *, 0x40) = var_v0_651(var_a0_647, var_a1_648);
        }
        goto block_196;
    case 0x80:
    case 0x81:
    case 0x82:
    case 0x83:
    case 0x84:
    case 0x85:
    case 0x86:
    case 0x87: {
        u8 opcode = ((volatile struct EventInstruction *)&frame.instruction)->opcode;
        u32 selector = (u8)frame.instruction.operand;
        s32 index = (u32)opcode & 7;
        s32 argument;
        s32 value;
        EventWriteFn writer;
        if (selector < 0xE5U) {
            argument = ((s16 *)frame.words)[selector & 7];
            value = FIELD(&stack[index], u16 *, 0x40);
            writer = ((EventWriteFn *)0x8018F2C0)[selector >> 3];
            writer(argument, 0, value);
            goto block_196;
        }
        goto block_196;
    }
    case 0x88:
    case 0x89:
    case 0x8A:
    case 0x8B:
    case 0x8C:
    case 0x8D:
    case 0x8E:
    case 0x8F:
        temp_v0_936 = (u16 *)((((u8)frame.instruction.opcode & 7) * 2) + (u32)stack);
        FIELD(temp_v0_936, s16 *, 0x40) = (s16) (FIELD(temp_v0_936, u8 *, 0x41) + ((u8) frame.instruction.operand << 8));
        goto block_196;
    case 0x90:
    case 0x91:
    case 0x92:
    case 0x93:
    case 0x94:
    case 0x95:
    case 0x96:
    case 0x97:
        temp_a1_945 = (u8) frame.instruction.operand & 7;
        temp_a0_946 = (u8) frame.instruction.opcode & 7;
        temp_v1_947 = (u8) frame.instruction.operand >> 3;
        switch (temp_v1_947) {
        case 0:
            temp_a0_958 = (u16 *)((temp_a0_946 * 2) + (u32)stack);
            FIELD(temp_a0_958, u16 *, 0x40) = (u16) (FIELD(temp_a0_958, u16 *, 0x40) & FIELD((u16 *)((temp_a1_945 * 2) + (u32)stack), u16 *, 0x40));
            break;
        case 1:
            temp_a0_968 = (u16 *)((temp_a0_946 * 2) + (u32)stack);
            FIELD(temp_a0_968, u16 *, 0x40) = (u16) (FIELD(temp_a0_968, u16 *, 0x40) | FIELD((u16 *)((temp_a1_945 * 2) + (u32)stack), u16 *, 0x40));
            break;
        case 2:
            temp_a0_978 = (u16 *)((temp_a0_946 * 2) + (u32)stack);
            FIELD(temp_a0_978, u16 *, 0x40) = (u16) (FIELD(temp_a0_978, u16 *, 0x40) + FIELD((u16 *)((temp_a1_945 * 2) + (u32)stack), u16 *, 0x40));
            break;
        case 3:
            temp_a0_988 = (u16 *)((temp_a0_946 * 2) + (u32)stack);
            FIELD(temp_a0_988, u16 *, 0x40) = (u16) (FIELD(temp_a0_988, u16 *, 0x40) - FIELD((u16 *)((temp_a1_945 * 2) + (u32)stack), u16 *, 0x40));
            break;
        case 4:
            temp_a0_998 = (u16 *)((temp_a0_946 * 2) + (u32)stack);
            FIELD(temp_a0_998, u16 *, 0x40) = (u16) (FIELD(temp_a0_998, u16 *, 0x40) * FIELD((u16 *)((temp_a1_945 * 2) + (u32)stack), u16 *, 0x40));
            break;
        case 5: {
            u32 dividend;
            u32 divisor;
            u16 *right;
            temp_a0_1011 = (u16 *)((temp_a0_946 * 2) + (u32)stack);
            right = (u16 *)((temp_a1_945 * 2) + (u32)stack);
            dividend = FIELD(temp_a0_1011, volatile u16 *, 0x40);
            divisor = FIELD(right, volatile u16 *, 0x40);
            dividend = dividend / divisor;
            FIELD(temp_a0_1011, u16 *, 0x40) = dividend;
            break;
        }
        case 6: {
            u32 dividend;
            u32 divisor;
            u16 *right;
            temp_a0_1028 = (u16 *)((temp_a0_946 * 2) + (u32)stack);
            right = (u16 *)((temp_a1_945 * 2) + (u32)stack);
            dividend = FIELD(temp_a0_1028, volatile u16 *, 0x40);
            divisor = FIELD(right, volatile u16 *, 0x40);
            divisor = dividend % divisor;
            FIELD(temp_a0_1028, u16 *, 0x40) = divisor;
            break;
        }
        }
        goto block_196;
    case 0x98:
    case 0x99:
    case 0x9A:
    case 0x9B:
    case 0x9C:
    case 0x9D:
    case 0x9E:
    case 0x9F:
        temp_a1_1046 = (u8) frame.instruction.operand & 0x1F;
        temp_a0_1047 = (u8) frame.instruction.opcode & 7;
        temp_v1_1048 = (u8) frame.instruction.operand >> 5;
        switch (temp_v1_1048) {
        case 0:
            temp_v1_1059 = (u16 *)((temp_a0_1047 * 2) + (u32)stack);
            FIELD(temp_v1_1059, u16 *, 0x40) = (u16) (FIELD(temp_v1_1059, u16 *, 0x40) & temp_a1_1046);
            break;
        case 1:
            temp_v1_1066 = (u16 *)((temp_a0_1047 * 2) + (u32)stack);
            FIELD(temp_v1_1066, u16 *, 0x40) = (u16) (FIELD(temp_v1_1066, u16 *, 0x40) | temp_a1_1046);
            break;
        case 2:
            temp_v1_1073 = (u16 *)((temp_a0_1047 * 2) + (u32)stack);
            FIELD(temp_v1_1073, u16 *, 0x40) = (u16) (FIELD(temp_v1_1073, u16 *, 0x40) + temp_a1_1046);
            break;
        case 3:
            temp_v1_1080 = (u16 *)((temp_a0_1047 * 2) + (u32)stack);
            FIELD(temp_v1_1080, u16 *, 0x40) = (u16) (FIELD(temp_v1_1080, u16 *, 0x40) - temp_a1_1046);
            break;
        case 4:
            temp_v1_1087 = (u16 *)((temp_a0_1047 * 2) + (u32)stack);
            FIELD(temp_v1_1087, u16 *, 0x40) = (u16) (FIELD(temp_v1_1087, u16 *, 0x40) * temp_a1_1046);
            break;
        case 5:
            temp_v1_1097 = (u16 *)((temp_a0_1047 * 2) + (u32)stack);
            FIELD(temp_v1_1097, u16 *, 0x40) = (u16) ((s32) FIELD(temp_v1_1097, u16 *, 0x40) / temp_a1_1046);
            break;
        case 6:
            temp_a0_1118 = (u16 *)((temp_a0_1047 * 2) + (u32)stack);
            FIELD(temp_a0_1118, u16 *, 0x40) = (u16) ((s32) FIELD(temp_a0_1118, u16 *, 0x40) % temp_a1_1046);
            break;
        }
        goto block_196;
    case 0xA1:
    case 0xA2:
    case 0xA3:
    case 0xA6:
    case 0xA7:
    case 0xAB:
        if (FIELD(((u8 *)(((u32) ((u8) frame.instruction.opcode & 0xC) >> 1) + (u32)stack)), u16 *, 0x40) != FIELD(&stack[(u8) frame.instruction.opcode & 3], u16 *, 0x40)) {

        } else {
            goto block_195;
        }
        goto block_196;
    case 0xAC:
    case 0xAD:
    case 0xAE:
    case 0xAF:
        if (FIELD(&stack[(u8) frame.instruction.opcode & 3], u16 *, 0x40) != 0) {

        } else {
            goto block_195;
        }
        goto block_196;
    case 0xB1:
    case 0xB2:
    case 0xB3:
    case 0xB6:
    case 0xB7:
    case 0xBB:
        if (FIELD(((u8 *)(((u32) ((u8) frame.instruction.opcode & 0xC) >> 1) + (u32)stack)), u16 *, 0x40) != FIELD(&stack[(u8) frame.instruction.opcode & 3], u16 *, 0x40)) {
            goto block_195;
        }
        goto block_196;
    case 0xBC:
    case 0xBD:
    case 0xBE:
    case 0xBF:
        if (FIELD(&stack[(u8) frame.instruction.opcode & 3], u16 *, 0x40) != 0) {
            goto block_195;
        }
        goto block_196;
    case 0xC1:
    case 0xC2:
    case 0xC3:
    case 0xC6:
    case 0xC7:
    case 0xCB: {
        u8 opcode = frame.instruction.opcode;
        u32 firstOffset = (opcode & 0xC) >> 1;
        const s16 *first = (const s16 *)(firstOffset + (u32)stack);
        u32 secondOffset = (opcode & 3) * 2;
        const s16 *second = (const s16 *)(secondOffset + (u32)stack);
        s32 left = first[32];
        s32 right = second[32];
        if (right < left) goto block_195;
        goto block_196;
    }
    case 0xCC:
    case 0xCD:
    case 0xCE:
    case 0xCF:
        if (FIELD(&stack[(u8) frame.instruction.opcode & 3], s16 *, 0x40) > 0) {
            goto block_195;
        }
        goto block_196;
    case 0xD1:
    case 0xD2:
    case 0xD3:
    case 0xD6:
    case 0xD7:
    case 0xDB: {
        u8 opcode = frame.instruction.opcode;
        u32 firstOffset = (opcode & 0xC) >> 1;
        const s16 *first = (const s16 *)(firstOffset + (u32)stack);
        u32 secondOffset = (opcode & 3) * 2;
        const s16 *second = (const s16 *)(secondOffset + (u32)stack);
        s32 left = first[32];
        s32 right = second[32];
        if (left < right) goto block_195;
        goto block_196;
    }
    case 0xDC:
    case 0xDD:
    case 0xDE:
    case 0xDF:
        if (FIELD(&stack[(u8) frame.instruction.opcode & 3], s16 *, 0x40) >= 0) {

        } else {
            goto block_195;
        }
        goto block_196;
    case 0xE1:
    case 0xE2:
    case 0xE3:
    case 0xE6:
    case 0xE7:
    case 0xEB: {
        u8 opcode = frame.instruction.opcode;
        u32 firstOffset = (opcode & 0xC) >> 1;
        const s16 *first = (const s16 *)(firstOffset + (u32)stack);
        u32 secondOffset = (opcode & 3) * 2;
        const s16 *second = (const s16 *)(secondOffset + (u32)stack);
        s32 left = first[32];
        s32 right = second[32];
        if (left >= right) goto block_195;
        goto block_196;
    }
    case 0xEC:
    case 0xED:
    case 0xEE:
    case 0xEF:
        if (FIELD(&stack[(u8) frame.instruction.opcode & 3], s16 *, 0x40) >= 0) {
            goto block_195;
        }
        goto block_196;
    case 0xF1:
    case 0xF2:
    case 0xF3:
    case 0xF6:
    case 0xF7:
    case 0xFB: {
        u8 opcode = frame.instruction.opcode;
        u32 firstOffset = (opcode & 0xC) >> 1;
        const s16 *first = (const s16 *)(firstOffset + (u32)stack);
        u32 secondOffset = (opcode & 3) * 2;
        const s16 *second = (const s16 *)(secondOffset + (u32)stack);
        s32 left = first[32];
        s32 right = second[32];
        if (right >= left) goto block_195;
        goto block_196;
    }
shift_records:
        memmove_0002cc00((u8 *)temp_s0_253 + 6, temp_s0_253, (0x78 - temp_a3_249) * 6);
insert_record:
        temp_s0_253->id = (u8)frame.instruction.operand;
        temp_s0_253->field02 = frame.words[0];
        temp_s0_253->field04 = (u8) frame.words[1];
        temp_s0_253->field05 = (u8) frame.words[2];
        goto block_196;
    case 0xFC:
    case 0xFD:
    case 0xFE:
    case 0xFF:
        if (FIELD(&stack[(u8) frame.instruction.opcode & 3], s16 *, 0x40) <= 0) {
            goto block_195;
        }
        goto block_196;
    case 0x01:
block_195:
        *cursor = (u16)(*cursor + (s8)frame.instruction.operand);
    default:
        break;
    }
block_196:
    *cursor = (u16)(*cursor + 1);
    }
}
