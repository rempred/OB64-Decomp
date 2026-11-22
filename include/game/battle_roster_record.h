#ifndef OB64_GAME_BATTLE_ROSTER_RECORD_H
#define OB64_GAME_BATTLE_ROSTER_RECORD_H

/* The scene table and the battle-side temporary both hold complete records.
 * Keep the word and low-byte views used by the roster consumers. */
typedef union BattleRosterClassWord {
    int word;
    struct BattleRosterClassBytes { unsigned char high[3]; unsigned char low; } bytes;
} BattleRosterClassWord;

typedef struct RosterRow {
    void *links[3];
    void *partners[3];
    unsigned char unknown18[8];
    unsigned short field20, field_22, field_24, field_26;
    unsigned short field_28, field_2A, field_2C, field_2E;
    unsigned char field_30, field_31, field_32, field_33, field_34, field_35;
    unsigned short field_36, field_38, field_3A, field_3C;
    unsigned char field_3E, field_3F;
    unsigned int flags40;
    int unknown44;
    BattleRosterClassWord class48;
    BattleRosterClassWord variant4C;
    int handle50;
    int column54;
    int row58;
    unsigned int word5C;
    unsigned char unknown60[4];
    unsigned int word64;
    unsigned char unknown68[4];
    int field6C;
    int field70;
    unsigned char unknown74[4];
    unsigned char field78;
    unsigned char unknown79[3];
    unsigned int field7C;
    unsigned char unknown80[0x14];
    int field94;
    unsigned char unknown98[0x5E];
    unsigned char fieldF6;
    unsigned char unknownF7;
} BattleRosterRecord;

typedef char BattleRosterRecordSizeCheck[sizeof(BattleRosterRecord) == 0xF8 ? 1 : -1];

int func_0020C164(BattleRosterRecord *record);
BattleRosterRecord *func_0020C788(void);
BattleRosterRecord *func_0020C810(void);
void func_0020CBDC(BattleRosterRecord *record, int mode);
void func_0020D870(BattleRosterRecord *record, int characterIndex);
int func_002344B4(BattleRosterRecord *record, int divisor);
void func_0020C908(BattleRosterRecord *record, int index);

/* The assembler helpers write and consume a caller-owned array of roster rows. */
int func_002337E4(BattleRosterRecord **out, int start, int column);
BattleRosterRecord *func_00233D0C(BattleRosterRecord *source, BattleRosterRecord **rows, int count);

int func_00233ED4(BattleRosterRecord *source);
int func_00233F38(BattleRosterRecord *source);
int func_00233F94(BattleRosterRecord *source);
int func_00237810(BattleRosterRecord *source, BattleRosterRecord *target);

int func_00222190(BattleRosterRecord *object, int x0, int z0, int x1, int z1);
int func_0022222C(BattleRosterRecord *source, BattleRosterRecord *target, int x, int z);
int func_00222344(BattleRosterRecord *object, int x0, int z0, int x1, int z1);
int func_0022B1F4(BattleRosterRecord *source, int *outWord);

int func_00237750(BattleRosterRecord *source, BattleRosterRecord *target, int c, int d, int e);
int func_00237890(void *source, void *target);
int func_002379AC(int effect, void *record);
void func_0023422C(void *record, int classId);
int func_002223E0(BattleRosterRecord *source, BattleRosterRecord *target, int mapZ, int mapX, int x, int z);
int func_002AB810(int *slots, BattleRosterRecord *unit, int index, int flip,
                  int classId, int variant, unsigned char seenLeader);

#endif
