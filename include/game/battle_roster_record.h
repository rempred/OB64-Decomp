#ifndef OB64_GAME_BATTLE_ROSTER_RECORD_H
#define OB64_GAME_BATTLE_ROSTER_RECORD_H

/* Scene slots and temporary battle actors use the same 0xF8-byte record.
 * Class IDs have both a full-word and a low-byte view. */
typedef union BattleRosterClassWord {
    int word;
    struct BattleRosterClassBytes { unsigned char high[3]; unsigned char low; } bytes;
} BattleRosterClassWord;

typedef struct RosterRow {
    void *primary_children[3];
    void *secondary_children[3];
    unsigned char unknown18[8];
    unsigned short hp, max_hp, strength, vitality;
    unsigned short intelligence, mentality, agility, dexterity;
    unsigned char luck, level, experience, element, alignment, field_35;
    unsigned short equipment_slot_0, equipment_slot_1, equipment_slot_2, equipment_slot_3;
    /* Reference alignment is kept separately from current alignment. */
    unsigned char fatigue, reference_alignment;
    unsigned int battle_flags;
    int unknown44;
    BattleRosterClassWord primary_class_id;
    BattleRosterClassWord secondary_class_id;
    int body_resource_key;
    int formation_column;
    int formation_row;
    unsigned int world_x;
    unsigned char world_y_bytes[4];
    unsigned int world_z;
    unsigned char target_actor_index_bytes[4];
    int actions_used;
    int action_limit;
    unsigned char unknown74[4];
    unsigned char action_kind;
    unsigned char unknown79[3];
    unsigned int action_id;
    unsigned char unknown80[0x14];
    int scheduled_time;
    unsigned char unknown98[0x5E];
    unsigned char member_index;
    unsigned char unknownF7;
} BattleRosterRecord;

typedef char BattleRosterRecordSizeCheck[sizeof(BattleRosterRecord) == 0xF8 ? 1 : -1];

int func_0020C164(BattleRosterRecord *record);
BattleRosterRecord *func_0020C788(void);
BattleRosterRecord *func_0020C810(void);
void func_0020CBDC(BattleRosterRecord *record, int mode);
void func_0020D870(BattleRosterRecord *actor, int member_index);
int func_002344B4(BattleRosterRecord *actor, int divisor);
void func_0020C908(BattleRosterRecord *actor, int member_index);

/* The assembler helpers write and consume a caller-owned array of roster rows. */
int func_002337E4(BattleRosterRecord **out, int start, int column);
BattleRosterRecord *func_00233D0C(BattleRosterRecord *source, BattleRosterRecord **rows, int count);

int func_00233ED4(BattleRosterRecord *source);
int func_00233F38(BattleRosterRecord *source);
int func_00233F94(BattleRosterRecord *source);
int func_00237810(BattleRosterRecord *source, BattleRosterRecord *target);

int func_00222190(BattleRosterRecord *actor, int x0, int z0, int x1, int z1);
int func_0022222C(BattleRosterRecord *actor, BattleRosterRecord *target, int x, int z);
int func_00222344(BattleRosterRecord *actor, int x0, int z0, int x1, int z1);
int func_0022B1F4(BattleRosterRecord *source, int *outWord);

int func_00237750(BattleRosterRecord *actor, BattleRosterRecord *target, int c, int d, int e);
int func_00237890(void *source, void *target);
int func_002379AC(int effect, void *record);
void func_0023422C(void *actor_record, int new_secondary_class_id);
int func_002223E0(BattleRosterRecord *actor, BattleRosterRecord *target, int formation_column, int formation_row, int x, int z);
int func_002AB810(int *slots, BattleRosterRecord *actor, int actor_index, int flip,
                  int primary_class_id, int secondary_class_id, unsigned char seen_leader);

#endif
