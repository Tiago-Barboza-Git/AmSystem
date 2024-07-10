export default function UserItem() {
  return (
    <div className="flex items-center justify-start gap-2 border rounded-[8px] p-4">
      <div className="avatar rounded-full h-8 w-8 bg-emerald-500 text-white font-[700] flex items-center justify-center">
        <p>TB</p>
      </div>
      <div>
        <p className="text-[16px] font-bold">Tiago Barboza Santos</p>
        <p className="text-[12px] text-neutral-500">
          tiago.barbozasantos@aol.com
        </p>
      </div>
    </div>
  );
}
