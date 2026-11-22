/*
 * UnpackProc: serve LZ unpack requests from the boot request queue (PURE_C replacement for the
 * earlier register-bound HYBRID source).  The format byte is the "%d" of the error report, so
 * no register binding is required.
 */
#include "common/types.h"
#include "common/os_message_queue.h"

typedef struct UnpackRequest {
    u32 field_00;
    MessageQueue *reply_queue;      /* +0x04: queue the finished request is sent back on */
    u8 format;              /* +0x08: 1 = LZ stream decoded by func_0000A510 */
    u8 pad_09[3];
    void *src;              /* +0x0C */
    void *dst;              /* +0x10 */
} UnpackRequest;

extern void func_00023940(const char *fmt, ...);                  /* diagnostic printf */
extern u32 func_0000A510(u8 *dst, const u8 *src);

extern MessageQueue g_boot_resource_lzss_table;                           /* request queue, 0x800AF320 */
/* Format string at 0x800AE038, relative to the existing 0x800B0000 link anchor. */
extern const char g_boot_resource_lzss_error_anchor[];

void func_0000B030(void *unused)
{
    void *request = 0;

    for (;;) {
        func_00023AE0(&g_boot_resource_lzss_table, &request, 1);
        if (((UnpackRequest *)request)->format == 1) {
            func_0000A510(((UnpackRequest *)request)->dst, ((UnpackRequest *)request)->src);
            func_00023C10(((UnpackRequest *)request)->reply_queue, request, 1);
        } else {
            func_00023940(g_boot_resource_lzss_error_anchor - 0x1FC8, ((UnpackRequest *)request)->format);
        }
    }
}
