#include "game/character_record.h"
#include "game/class_field_lookups.h"
#include "game/indexed_record_lookup.h"

typedef struct TextRecordSelection {
    u8 pool;
    u8 index;
} TextRecordSelection;

extern TextRecordSelection D_801939D3;
extern u8 D_801939D4, D_801939D5, D_801939D6, D_801939D8, D_801939E8;
extern s32 D_8019391C[], D_801939DC, D_801939E4;
extern u16 D_801939DE;
extern u8 D_80193A90[];
extern u8 *D_80196AF8;

extern u8 func_00043b2c(int primary_class_id, int secondary_class_id);
extern u8 D_8016DEC4(int primary_class_id, int secondary_class_id);
extern int D_8016E230(int primary_class_id, int secondary_class_id, int mode);
extern u8 D_8016E470(int action, int item0, int item1, int item2, u16 item3);
extern u8 D_8016E50C(u8 *action, int primary_class_id, int secondary_class_id,
                      int action_id, u8 element, u16 item0, u16 item1, u16 item2, u16 item3);
extern u8 func_8016F500(s32 item);
extern s8 *func_8016F5B0(s32 item);
extern u8 func_8016F5C8(s32 item);
extern u8 *func_8009C550(u8 *destination, const u8 *source);
extern s32 func_80093460(const s8 *text);
extern u8 *func_000559f8(u8 *destination, s32 text_table_offset, s32 entry);

/* Expand embedded substitutions in a text line, returning the substitution count. */
s32 func_00055b28(u8 *source, u8 *destination, const u8 *supplied_text)
{
    CharacterRecord *record;
    u8 *input;
    u8 *output;
    s32 substitutions = 0;
    /* Read the index and then the adjacent pool byte from one base. */
    u8 *selection = (u8 *)&D_801939D3 + 1;
    u32 selected_index = *selection--;
    u8 pool = *selection;

    selected_index &= -(selected_index < 100);
    if (pool == 0) {
        record = &D_80193BC0[selected_index].record;
    } else {
        record = &D_80195560[(u8)selected_index];
    }

    input = source;
    output = destination;

    for (;;) {
        u8 byte = input[0];
        u8 second = input[1];
        s32 lead = byte & 0xFF;
        u32 first = lead & 0xFFFF;
        s32 control;
        const u8 *text;
        u16 equipment[4];
        u8 action;
        s32 action_id;

        if ((first == '\r') & (second == '\n')) {
            break;
        }
        if (first <= 0x80 || (((u32)(lead - 0xA0) < 0x40) | (first >= 0xFD))) {
            *output = byte;
            ++input;
            ++output;
            continue;
        }
        control = second | (lead << 8);
        if (control == 0x8194) {
            s32 started = 0;
            s32 value;
            s32 divisor;
            input += 2;
            value = D_8019391C[*input];
            input += 2;
            divisor = 10000;
            if (value < 0) {
                *output++ = '-';
                value = (s32)(0u - (u32)value);
            }
            if (value > 99999) {
                value = 99999;
            }
            do {
                if (!started) {
                    if (divisor == 1 || value / divisor > 0) {
                        started = 1;
                    }
                }
                if (started) {
                    s32 digit = value / divisor;
                    digit %= 10;
                    *output = digit + '0';
                    ++output;
                    value -= digit * divisor;
                }
                divisor /= 10;
            } while (divisor > 0);
        } else if (control == 0x8196) {
            s32 code;
            ++substitutions;
            input += 2;
            code = input[1] | (input[0] << 8);
            input += 2;
            switch (code) {
            case 0x3031: {
                D_801939E8 = 0;
                action_id = func_00043b2c(record->primary_class_id, record->secondary_class_id);
                D_8016E50C(&action, record->primary_class_id, record->secondary_class_id, (u8)action_id,
                            record->element, record->equipment_slot_0, record->equipment_slot_1,
                            record->equipment_slot_2, record->equipment_slot_3);
                output = func_000559f8(output, 0x01DE67C2, action);
                break;
            }
            case 0x3032: {
                D_801939E8 = 1;
                action_id = D_8016E230(record->primary_class_id, record->secondary_class_id, 1);
                D_8016E50C(&action, record->primary_class_id, record->secondary_class_id, (u8)action_id,
                            record->element, record->equipment_slot_0, record->equipment_slot_1,
                            record->equipment_slot_2, record->equipment_slot_3);
                output = func_000559f8(output, 0x01DE67C2, action);
                break;
            }
            case 0x3033: {
                D_801939E8 = 2;
                action_id = D_8016E230(record->primary_class_id, record->secondary_class_id, 2);
                D_8016E50C(&action, record->primary_class_id, record->secondary_class_id, (u8)action_id,
                            record->element, record->equipment_slot_0, record->equipment_slot_1,
                            record->equipment_slot_2, record->equipment_slot_3);
                output = func_000559f8(output, 0x01DE67C2, action);
                break;
            }
            case 0x3034:
                break;
            case 0x3035:
                output = func_000559f8(output, 0x01DE5EDC, record->element + 19);
                break;
            case 0x3036:
                if (D_8016DEC4(D_80193BC0[1].record.primary_class_id,
                               D_80193BC0[1].record.secondary_class_id) == 2) {
                    output = func_000559f8(output, 0x01DE5EDC, 86);
                    break;
                }
                break;
            case 0x3037: {
                u8 *menu = D_80196AF8;
                u8 *menu_row = menu + D_801939D5 * 0x36;
                output = func_000559f8(output, 0x01DE5EDC, menu_row[0x1199] - 1);
                break;
            }
            case 0x3038: {
                u8 *menu = D_80196AF8;
                u8 *menu_row = menu + D_801939D6 * 0xE;
                output = func_000559f8(output, 0x01DE5EDC, menu_row[0x10DB] + 6);
                break;
            }
            case 0x3039: {
                u8 *menu = D_80196AF8;
                u8 *menu_row = menu + D_801939D6 * 0xE;
                output = func_000559f8(output, 0x01DE5EDC, menu_row[0x10DE] - 1);
                break;
            }
            case 0x3130: {
                s32 slot;
                u16 *item;
                EquipmentSelector *fallback;

                action_id = D_8016E230(record->primary_class_id, record->secondary_class_id, D_801939E8);
                equipment[0] = record->equipment_slot_0;
                equipment[1] = record->equipment_slot_1;
                equipment[2] = record->equipment_slot_2;
                equipment[3] = record->equipment_slot_3;
                slot = 0;
                item = equipment;
                fallback = g_func_0018B494_equipment_selectors;

                /* The explicit back edge preserves the compiler's saved-register allocation. */
next_equipment_slot:
                if (*item == 0) {
                    *item = (*fallback)(record->primary_class_id, record->secondary_class_id);
                }
                ++item;
                ++slot;
                ++fallback;
                if (slot < 4) {
                    goto next_equipment_slot;
                }
                D_8016E50C(&action, record->primary_class_id, record->secondary_class_id, (u8)action_id,
                           record->element, equipment[0], equipment[1], equipment[2], equipment[3]);
                output = func_000559f8(output, 0x01DE5EDC,
                                     D_8016E470(action, equipment[0], equipment[1], equipment[2], equipment[3]) + 24);
                break;
            }
            case 0x3131:
                output = func_000559f8(output, 0x01DE7414, 0);
                break;
            case 0x3132:
                output = func_000559f8(output, 0x01DE7414, 1);
                break;
            case 0x3133:
                output = func_000559f8(output, 0x01DE7414, 2);
                break;
            case 0x3134:
                output = func_000559f8(output, 0x01DE7414, 3);
                break;
            case 0x3135:
                text = D_80193BC0[D_801939D4].record.name;
                func_8009C550(output, text);
                output += func_80093460((const s8 *)text);
                break;
            case 0x3136:
                output = func_000559f8(output, 0x01DE5EDC, D_80196AF8[0x9D] + 83);
                break;
            case 0x3137:
                text = D_80193BC0[1].record.name;
                goto append_text;
            case 0x3138:
                func_8009C550(output, supplied_text);
                output += func_80093460((const s8 *)supplied_text);
                break;
            case 0x3139: {
                u16 class_id = *(u16 *)(D_80196AF8 + 0x5E8);
                text = *(const u8 *const *)&g_func_0019554C_class_records[class_id];
                goto append_text;
            }
            case 0x3230:
                text = D_80193A90;
                goto append_text;
            case 0x3231:
                text = (const u8 *)func_8016F4E0(D_801939DE);
                goto append_text;
            case 0x3232:
                output = func_000559f8(output, 0x01DE39DA, func_8016F500(D_801939DE) + 103);
                break;
            case 0x3233:
                output = func_000559f8(output, 0x01DE31CA, D_801939DC);
                break;
            case 0x3234:
                text = (const u8 *)func_8016F5B0(D_801939DE);
append_text:
                func_8009C550(output, text);
                output += func_80093460((const s8 *)text);
                break;
            case 0x3235:
                output = func_000559f8(output, 0x01DE39DA, func_8016F5C8(D_801939DE) + 76);
                break;
            case 0x3236:
                output = func_000559f8(output, 0x01DE0090, D_801939DC);
                break;
            case 0x3237:
                output = func_000559f8(output, 0x01DE39DA, D_801939E4);
                break;
            case 0x3238: {
                s32 high = input[0];
                s32 low = input[1];
                s32 digits = low + (high << 8);
                input += 2;
                if (D_801939D8 != 0) {
                    output = func_000559f8(output, 0x01DE45D4,
                                         ((((u32)(digits & 0xFF00) >> 8) - '0') * 10 + 152) + (digits & 0xFF));
                    break;
                }
                break;
            }
            case 0x3239:
                output = func_000559f8(output, 0x01DE5EDC, D_801939DC + 15);
                break;
            }
        } else {
            ++input;
            *output++ = byte;
            *output++ = *input++;
        }
        continue;
    }

    output[0] = '\r';
    output[1] = '\n';
    return substitutions;
}
