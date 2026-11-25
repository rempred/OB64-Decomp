#include "game/battle_recruitment.h"
#include "game/battle_roster_side_one.h"
#include "game/battle_roster_types.h"
#include "game/class_field_lookups.h"
#include "game/combat_selector.h"
#include "game/cutscene_panels.h"

typedef struct TerminalBridgeState TerminalBridgeState;

typedef struct PersuasionChild {
    u8 prefix[0x1C];
    s16 current_x;
    s16 current_y;
    s16 current_z;
    u8 field_22[0x22];
    Func001F0E64Record pose;
} PersuasionChild;

/* Each primary slot's corresponding secondary slot is three pointers later. */
typedef struct PersuasionChildSlotPair {
    void *primary;
    void *intervening_slots[2];
    void *secondary;
} PersuasionChildSlotPair;

typedef struct PersuasionScene {
    u8 prefix[0x1C4];
    BattleRosterRecord roster[20];
    u8 field_1524[0x3C00];
    u8 field_5124[0x19C];
    u8 field_52C0[0x400];
    s32 field_56C0;
    u8 field_56C4[0x110];
    Panel *message_panel;
    u8 field_57D8[0x870];
    s32 persuasion_state;
    u8 field_604C[4];
    s32 phase_ticks;
    u8 field_6054[0x20];
    u8 field_6074;
    u8 field_6075[0x12];
    u8 field_6087;
    u8 field_6088[0x0C];
} PersuasionScene;

/* The native scene pointer is reread after calls and indirect writes. */
extern u8 *D_801CE8BC;
extern u8 *D_801CE8C0;
extern s32 D_801CE8C4;
extern const char rodata_002299c8[];

extern s32 func_0021495C(void);
extern void func_0021EAF0(TerminalBridgeState *state);
extern void func_001F2E48(s8 *text, s32 side);
extern float func_001FF7EC(s16 x, s16 z);
extern float func_002016F4(s32 source_art, s32 owner_context);
extern void func_00232D7C(void);
extern void func_0020BD5C(s32 selector);
extern void battle_roster_write_back_members(void);
extern void *resource_alloc(u32 bytes);
extern void *resource_free(void *resource);
extern void bcopy(const void *source, void *destination, s32 bytes);
extern s32 sprintf(char *buffer, const char *format, ...);
extern s32 rand(void);

#define SCENE ((PersuasionScene *)D_801CE8BC)

enum {
    PERSUASION_CHILD_COUNT = 3,
    PERSUASION_CONFIRM_TICK = 60,
    NOT_PERSUADED_FORMAT_OFFSET = 0x1C
};

/* Advance the battle's persuasion sequence and transfer a recruited actor. */
void func_00219A14(void)
{
    s8 message[0x80];
    s8 *message_buffer;
    BattleRosterRecord *actor;
    BattleRosterRecord *failure_actor;
    PersuasionScene *scene;
    PersuasionScene *snapshot;
    s32 ticks;
    s32 next_mode;
    const u8 *actor_name;
    const char *format;
    u8 saved_resolution_byte;
    u32 snapshot_size;

    switch (SCENE->persuasion_state) {
    case 0: {
        s32 result = func_0021495C();

        if (result == 0) {
            SCENE->persuasion_state = 1;
            goto reset_ticks;
        }
        if (result == 1) {
            next_mode = 11;
            goto advance_mode;
        }
        if (result == 2) {
            SCENE->field_6074 = 1;
            SCENE->persuasion_state = 3;
            goto reset_ticks;
        }
        SCENE->persuasion_state = 2;
reset_ticks:
        SCENE->phase_ticks = 0;
        return;
    }

    case 1:
        actor = (BattleRosterRecord *)battle_roster_find_first_side_one();
        ticks = SCENE->phase_ticks;
        if (ticks == 0) {
            actor_name = func_8016E1DC(actor->primary_class_id.bytes.low,
                                      actor->secondary_class_id.bytes.low);
            format = rodata_002299c8;
            message_buffer = message;
            goto show_message;
        }
        if (ticks < PERSUASION_CONFIRM_TICK) {
            void **child_slot;
            u32 random_index;
            s32 child_index;

            func_0021EAF0((TerminalBridgeState *)actor);
            child_index = 0;
            for (; child_index < PERSUASION_CHILD_COUNT; child_index++) {
                PersuasionChild *child = actor->primary_children[child_index];

                if (child != 0) {
                    s32 selector = (s16)child->pose.field_04;
                    if (selector == 0x20) {
                        func_001F0E64(&child->pose, 0x21);
                        child = actor->primary_children[child_index];
                        selector = (s16)child->pose.field_04;
                    }
                    if (selector == 0x22) {
                        func_001F0E64(&child->pose, 0x23);
                    }
                }
            }

            random_index = 0;
            do {
                PersuasionChild *child = actor->primary_children[random_index];

                if (child != 0) {
                    s16 selector = child->pose.field_04;
                    s32 start_pose = 0;

                    if (selector < 5 || (u16)(selector - 0x32) < 5U) {
                        start_pose = 1;
                    }
                    if (start_pose) {
                        u32 first, second, third;
                        u32 quotient;
                        PersuasionChild *offset_child;

                        func_001F0E64(&((PersuasionChild *)actor->primary_children[random_index])->pose, 5);
                        first = rand();
                        second = rand();
                        third = rand();
                        first <<= 18;
                        first &= 0x0C000000u;
                        second <<= 15;
                        first |= second;
                        first |= third;
                        offset_child = actor->primary_children[random_index];
                        /* Keep the random word live while computing the offset. */
                        quotient = first / 20U;
                        first -= quotient * 20U;
                        offset_child->pose.field_08 = first;
                    }
                }
                random_index++;
            } while (random_index < PERSUASION_CHILD_COUNT);

            if ((s16)((PersuasionChild *)actor->primary_children[0])->pose.field_04 == 5) {
                u32 moved_count = 0;
                s32 distance = (s32)(func_002016F4(actor->primary_class_id.word,
                                                    actor->secondary_class_id.word) / 2.0f);

                child_slot = actor->primary_children;
                /* Use one cursor for the paired primary and secondary slots. */
move_child:
                {
                    PersuasionChild *child = *child_slot;
                    s32 height;

                    moved_count++;
                    if (child != 0) {
                        child->current_x = (u16)child->current_x + distance;
                        {
                            PersuasionChild *positioned_child = *child_slot;
                            height = (s32)func_001FF7EC(positioned_child->current_x, positioned_child->current_z);
                        }
                        ((PersuasionChild *)*child_slot)->current_y = height;
                        ((PersuasionChild *)((PersuasionChildSlotPair *)child_slot)->secondary)->current_x =
                            ((PersuasionChild *)*child_slot)->current_x;
                        ((PersuasionChild *)((PersuasionChildSlotPair *)child_slot)->secondary)->current_y =
                            ((PersuasionChild *)*child_slot)->current_y;
                    }
                    child_slot++;
                }
                if (moved_count < PERSUASION_CHILD_COUNT) {
                    goto move_child;
                }
                goto advance_ticks;
            }
            goto advance_ticks;
        }
        if (ticks != PERSUASION_CONFIRM_TICK) {
            func_002142C4();
            snapshot_size = sizeof(*snapshot);
            SCENE->field_6087 = 3;
            goto finish;
        }
        func_001F0E64(&((PersuasionChild *)actor->primary_children[0])->pose, 6);
        goto advance_ticks;

    case 2:
        failure_actor = (BattleRosterRecord *)battle_roster_find_first_side_one();
        scene = SCENE;
        ticks = scene->phase_ticks;
        if (ticks == 0) {
            goto failed_message;
        }
        if (ticks >= 30) {
            Panel *panel = scene->message_panel;
            if (panel != 0) {
                func_000521fc(panel);
                SCENE->message_panel = 0;
            }
            SCENE->persuasion_state = 10;
        }
        goto advance_ticks;

    case 3:
        failure_actor = (BattleRosterRecord *)battle_roster_find_first_side_one();
        scene = SCENE;
        ticks = scene->phase_ticks;
        if (ticks == 0) {
failed_message:
            /* States 2 and 3 use the same failure message on their first tick. */
            actor_name = func_8016E1DC(failure_actor->primary_class_id.bytes.low,
                                      failure_actor->secondary_class_id.bytes.low);
            message_buffer = message;
            format = rodata_002299c8 + NOT_PERSUADED_FORMAT_OFFSET;
show_message:
            sprintf((char *)message_buffer, format, (const char *)actor_name);
            func_001F2E48(message, 0);
        } else if (ticks >= 20) {
            scene->persuasion_state = 10;
        }
advance_ticks:
        SCENE->phase_ticks++;
        return;

    case 10:
        snapshot_size = sizeof(*snapshot);
finish:
        D_801CE8C4 = 1;
        snapshot = resource_alloc(snapshot_size);
        scene = SCENE;
        *(s32 *)(D_801CE8C0 + 0x814) = 0;
        bcopy(scene, snapshot, sizeof(*snapshot));
        saved_resolution_byte = D_801CE8C0[0x82E];
        func_00232D7C();
        D_801CE8C0[0x82E] = saved_resolution_byte;

        bcopy(snapshot->roster, SCENE->roster, sizeof(snapshot->roster));
        bcopy(snapshot->field_1524, SCENE->field_1524, sizeof(snapshot->field_1524));
        bcopy(snapshot->field_5124, SCENE->field_5124, sizeof(snapshot->field_5124));
        bcopy(snapshot->field_52C0, SCENE->field_52C0, sizeof(snapshot->field_52C0));
        SCENE->field_56C0 = snapshot->field_56C0;
        resource_free(snapshot);
        battle_roster_write_back_members();
        next_mode = 1;
advance_mode:
        func_0020BD5C(next_mode);
        return;
    }
}

