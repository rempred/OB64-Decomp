#ifndef OB64_GAME_RUNTIME_UNIT_SOURCE_H
#define OB64_GAME_RUNTIME_UNIT_SOURCE_H

/* The two source-record consumers read the runtime unit's flags at +0,
 * source index at +4, and signed word at +0x74. Other fields stay unnamed. */
typedef struct RuntimeUnitSource {
    unsigned int flags;
    unsigned char source_index;
    unsigned char unknown05[0x6F];
    int field74;
} RuntimeUnitSource;

/* Runtime table entries have several incomplete/local views at callers.
 * Preserve that storage boundary; use the common field view in the consumers. */
void *func_0012E7E8(void *unit);
int func_0012F530(void *unit);

#endif
