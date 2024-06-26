import { sql } from "@vercel/postgres";
import { revalidatePath } from 'next/cache';

// read pin from env variable
const PIN = process.env.PIN;

async function updateNote(FormData: FormData) {
    "use server"
    const updated = {
        slug: String(FormData.get('slug')),
        title: String(FormData.get('title')),
        date: String(FormData.get('date')),
        views: Number(FormData.get('views')),
        cta: String(FormData.get('cta')),
        cta_link: String(FormData.get('cta_link')),
        pin: FormData.get('pin'),
    }

    // check if the pin is correct
    if (updated.pin !== PIN) return;

    // update the note in the database
    await sql`UPDATE NOTES SET title=${updated.title}, date=${updated.date}, views=${updated.views}, cta=${updated.cta}, cta_link=${updated.cta_link} WHERE slug=${updated.slug}`;

    // revalidate the page
    revalidatePath("/notes");
    revalidatePath("/notes/edit");
    revalidatePath(`/notes/${updated.slug}`);
}

async function updateChapter(FormData: FormData) {
    "use server"
    const updated = {
        chapter_id: Number(FormData.get('chapter_id')),
        note_slug: String(FormData.get('note_slug')),
        title: String(FormData.get('title')),
        content: String(FormData.get('content')),
        image: String(FormData.get('image')),
        width: Number(FormData.get('width')),
        height: Number(FormData.get('height')),
        pin: FormData.get('pin'),
    }

    // check if the pin is correct
    if (updated.pin !== PIN) return;

    // update the note in the database
    await sql`UPDATE CHAPTERS SET title=${updated.title}, content=${updated.content}, image=${updated.image}, width=${updated.width}, height=${updated.height} WHERE chapter_id=${updated.chapter_id}`;

    // revalidate the page
    revalidatePath("/notes/edit");
    revalidatePath(`/notes/${updated.note_slug}`);
}

export default async function Page() {
    // get all the notes from the database
    const { rows: notes } = await sql`SELECT * from NOTES order by date desc`;

    // get all the chapters from the database
    const { rows: chapters } = await sql`SELECT * from CHAPTERS order by note_slug, chapter_id`;

    return (
        <main>
            {/* Generate a form for each note */}
            {notes.map((note, index) => (
                <form key={index} className="max-w-sm w-full flex flex-col gap-2 p-2 border border-gray-800 rounded-lg" action={updateNote}>
                    <div className="flex gap-2">
                    <label htmlFor={`slug-${note.slug}`}>slug:</label>
                    <input id={`slug-${note.slug}`} name="slug" defaultValue={note.slug} readOnly /></div>
                    
                    <div className="flex gap-2">
                    <label htmlFor={`title-${note.slug}`}>title:</label>
                    <input id={`title-${note.slug}`} name="title" defaultValue={note.title} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`date-${note.slug}`}>date:</label>
                    <input id={`date-${note.slug}`} name="date" defaultValue={note.date} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`views-${note.slug}`}>views:</label>
                    <input id={`views-${note.slug}`} name="views" defaultValue={note.views} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`cta-${note.slug}`}>cta:</label>
                    <textarea id={`cta-${note.slug}`} name="cta" defaultValue={note.cta} rows={4} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`cta_link-${note.slug}`}>cta_link:</label>
                    <input id={`cta_link-${note.slug}`} name="cta_link" defaultValue={note.cta_link} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`pin-${note.slug}`}>pin:</label>
                    <input id={`pin-${note.slug}`} name="pin" type="password" /></div>

                    <button type="submit">Save</button>
                </form>
            ))}
            {/* Generate a form for each chapter */}
            {chapters.map((chapter, index) => (
                <form key={index} className="max-w-sm w-full flex flex-col gap-2 p-2 border border-gray-800 rounded-lg" action={updateChapter}>
                    <div className="flex gap-2">
                    <label htmlFor={`chapter_id-${chapter.chapter_id}`}>chap_id:</label>
                    <input id={`chapter_id-${chapter.chapter_id}`} name="chapter_id" defaultValue={chapter.chapter_id} readOnly /></div>
                    
                    <div className="flex gap-2">
                    <label htmlFor={`note_slug-${chapter.note_slug}`}>note_slug:</label>
                    <input id={`note_slug-${chapter.note_slug}`} name="note_slug" defaultValue={chapter.note_slug} readOnly /></div>
                    
                    <div className="flex gap-2">
                    <label htmlFor={`title-${chapter.chapter_id}`}>title:</label>
                    <input id={`title-${chapter.chapter_id}`} name="title" defaultValue={chapter.title} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`content-${chapter.chapter_id}`}>content:</label>
                    <textarea id={`content-${chapter.chapter_id}`} name="content" defaultValue={chapter.content} rows={4} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`image-${chapter.chapter_id}`}>iamge:</label>
                    <input id={`image-${chapter.chapter_id}`} name="image" defaultValue={chapter.image} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`width-${chapter.chapter_id}`}>width:</label>
                    <input id={`width-${chapter.chapter_id}`} name="width" defaultValue={chapter.width} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`height-${chapter.chapter_id}`}>height:</label>
                    <input id={`height-${chapter.chapter_id}`} name="height" defaultValue={chapter.height} /></div>

                    <div className="flex gap-2">
                    <label htmlFor={`pin-${chapter.chapter_id}`}>pin:</label>
                    <input id={`pin-${chapter.chapter_id}`} name="pin" type="password" /></div>

                    <button type="submit">Save</button>
                </form>
            ))}
        </main>
    );
}