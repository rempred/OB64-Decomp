#include "common/types.h"

typedef struct PanelContent {
    u8 text[0x500];
    u8 pad500[0x30];
    u8 *rows[48];
    u8 field5F0;
    u8 field5F1;
    u8 pad5F2;
    u8 field5F3;
    u8 field5F4;
    u8 field5F5;
    u8 field5F6;
    u8 field5F7;
    u8 pad5F8[6];
    u8 field5FE;
    u8 pad5FF;
    s32 key;
} PanelContent;

typedef struct Panel {
    u8 pad00[0x22];
    u8 field22;
    u8 pad23[2];
    u8 field25;
    u8 pad26[0xAA];
    PanelContent *content;
} Panel;

typedef struct PanelSubject {
    u8 pad00[0x2C];
    s16 field2C;
} PanelSubject;

typedef struct PanelPositionState {
    PanelSubject *subjects[0x23C / 4];
    u8 pad23C;
    u8 field23D;
} PanelPositionState;

typedef struct PanelParameters {
    u8 pad00[0x24];
    u8 selectedName[0x41];
} PanelParameters;

typedef struct SectionDelimiter {
    u8 cr;
    u8 lf;
    u8 secondCr;
    u8 secondLf;
} SectionDelimiter;

extern PanelPositionState *D_8023DE30;
extern PanelParameters *D_8023DE34;

extern s32 resource_free(void *);
extern void bzero(void *, s32);
extern void bcopy(const void *, void *, u32);
extern void func_80080998(void *, const void *, s32);
extern u8 *func_002839E8(u32, s32);
extern u8 *func_00296CE0(s16);
extern void func_8009C550(u8 *, const u8 *);
extern void func_8009C620(u8 *, const u8 *);

PanelContent *func_00296754(Panel *panel, s32 section)
{
    u8 scratch[0x500];
    u8 *buffer;
    PanelContent *content;
    u8 *archive;
    u8 *scan;
    s32 offset;
    s32 seen;
    s32 start;
    s32 rows;
    s32 subjectMarker;
    s32 bufferSize;
    u16 wanted;
    s32 index;
    u8 *rowCursor;
    const u8 *name;

    bzero(scratch, sizeof(scratch));
    buffer = scratch;
    wanted = section & 0xff;
    content = panel->content;
    archive = func_002839E8(0x018855FE, 0);
    seen = 0;
    start = 0;
    offset = 0;
    do {
        u8 *cursor = archive + offset;
        u8 cr = cursor[0];
        u8 lf;

        if (cr == 13 && (lf = cursor[1], lf == 10) && cursor[2] == cr && cursor[3] == lf) {
            seen++;
            if (wanted == seen) {
                u8 *destination = buffer;
                s32 length = offset - start;

                bzero(destination, length + 2);
                func_80080998(destination, archive + start, length);
                break;
            }
            start = offset + 4;
        }
    } while (++offset <= 0x0FFFFFFE);
    resource_free(archive);

    bcopy(scratch, content->text, 0x500);
    scan = content->text;
    content->rows[0] = scan;
    rows = 1;
    index = 0;
    subjectMarker = 0x878D;
    bufferSize = 0x500;
    rowCursor = (u8 *)content + 4;

    do {
        s32 marker = scan[1] | (scan[0] << 8);

        if (marker == subjectMarker) {
            goto subject;
        }
        if (marker > subjectMarker) {
            goto high_marker;
        }
        if (marker == 0x8197) {
            goto newline;
        }
        scan++;
        goto advance;

high_marker:
        if (marker > 0x878F) {
            scan++;
            goto advance;
        }
        goto selected;

subject:
        {
            PanelPositionState *state = D_8023DE30;
            s16 id = state->subjects[state->field23D]->field2C;

            name = func_00296CE0(id);
        }
        func_80080998(scratch, scan + 2, bufferSize - index);
        func_8009C550(scan, name);
        goto append;

selected:
        func_80080998(scratch, scan + 2, bufferSize - index);
        func_8009C550(scan, D_8023DE34->selectedName);
append:
        func_8009C620(scan, scratch);
        goto next;

newline:
        scan[0] = 0;
        scan += 2;
        *(u8 **)(rowCursor + 0x530) = scan;
        rowCursor += 4;
        rows++;
        index += 2;
        if (rows >= 48) {
            index = 0x500;
        }
        goto next;
advance:
        index++;
next:
        ;
    } while (index < 0x500);

    panel->field25 = rows;
    content->field5F4 = rows;
    content->field5F5 = rows;
    return content;
}
