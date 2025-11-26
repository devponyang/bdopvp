"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type ApplicationStatus = "pending" | "approved" | "rejected" | "waitlist"

interface Member {
  familyName: string
  className: string
  score?: number
}

interface Application {
  id: number
  team_name: string
  leader_family_name: string
  leader_character_name: string
  leader_discord: string
  team_members: Member[]
  substitute_member: Member | null
  notes: string | null
  agree_rules: boolean
  status: ApplicationStatus
  created_at: string
  edit_password?: string
}

interface EditFormState {
  teamName: string
  leaderFamilyName: string
  leaderDiscord: string
  editPassword: string
  notes: string
  members: Member[]
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "대기",
  approved: "승인",
  rejected: "거절",
  waitlist: "대기열"
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/40",
  approved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  rejected: "bg-red-500/10 text-red-300 border-red-500/40",
  waitlist: "bg-blue-500/10 text-blue-200 border-blue-500/40"
}

export default function AdminSolareTournamentPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [editForm, setEditForm] = useState<EditFormState | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/Tournament/applications", { cache: "no-store" })
      if (!res.ok) {
        throw new Error("신청서 목록을 불러오지 못했습니다.")
      }
      const data = (await res.json()) as Application[]
      const parsed = data.map((app) => ({
        ...app,
        team_members: Array.isArray(app.team_members)
          ? app.team_members
          : JSON.parse(app.team_members as unknown as string),
        substitute_member: app.substitute_member
          ? typeof app.substitute_member === "string"
            ? JSON.parse(app.substitute_member)
            : app.substitute_member
          : null
      }))
      setApplications(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = selectedStatus === "all" || app.status === selectedStatus
      const term = searchTerm.trim().toLowerCase()
      if (!term) return matchesStatus
      const serialized = [
        app.team_name,
        app.leader_family_name,
        app.leader_discord,
        app.team_members.map((m) => `${m.familyName}${m.className}${m.score ?? ""}`).join(" ")
      ]
        .join(" ")
        .toLowerCase()
      return matchesStatus && serialized.includes(term)
    })
  }, [applications, searchTerm, selectedStatus])

  const handleStatusUpdate = async (id: number, status: ApplicationStatus) => {
    try {
      const res = await fetch(`/api/Tournament/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      if (!res.ok) {
        throw new Error("상태 변경에 실패했습니다.")
      }
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "상태 변경 중 오류가 발생했습니다.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("이 신청서를 삭제하시겠습니까?")) return
    try {
      const res = await fetch(`/api/Tournament/applications/${id}`, {
        method: "DELETE"
      })
      if (!res.ok) {
        throw new Error("삭제에 실패했습니다.")
      }
      setApplications((prev) => prev.filter((app) => app.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.")
    }
  }

  const openEditModal = (app: Application) => {
    setEditingApp(app)
    setEditForm({
      teamName: app.team_name,
      leaderFamilyName: app.leader_family_name,
      leaderDiscord: app.leader_discord,
      editPassword: app.edit_password ?? "",
      notes: app.notes ?? "",
      members: app.team_members.map((member) => ({
        familyName: member.familyName,
        className: member.className,
        score: member.score
      }))
    })
  }

  const closeEditModal = () => {
    if (saving) return
    setEditingApp(null)
    setEditForm(null)
  }

  const handleEditMemberChange = (index: number, key: keyof Member, value: string) => {
    if (!editForm) return
    setEditForm((prev) => {
      if (!prev) return prev
      const members = prev.members.map((member, idx) =>
        idx === index
          ? {
              ...member,
              [key]:
                key === "score"
                  ? value === ""
                    ? undefined
                    : Number(value)
                  : value
            }
          : member
      )
      return { ...prev, members }
    })
  }

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editingApp || !editForm) return

    if (!editForm.teamName.trim()) {
      alert("팀명을 입력해주세요.")
      return
    }

    if (editForm.teamName.trim().length > 6) {
      alert("팀명은 최대 6글자까지 입력할 수 있습니다.")
      return
    }

    if (!editForm.members.every((m) => m.familyName.trim() && m.className.trim())) {
      alert("팀원 가문명과 클래스를 모두 입력해주세요.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/Tournament/applications/${editingApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: editForm.teamName.trim(),
          leaderFamilyName: editForm.leaderFamilyName.trim(),
          leaderDiscord: editForm.leaderDiscord.trim(),
          editPassword: editForm.editPassword.trim(),
          notes: editForm.notes.trim() || null,
          members: editForm.members.map((member) => ({
            familyName: member.familyName.trim(),
            className: member.className.trim(),
            score: typeof member.score === "number" ? member.score : undefined
          }))
        })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "저장에 실패했습니다.")
      }

      const updated = (await res.json()) as Application
      setApplications((prev) =>
        prev.map((app) => (app.id === updated.id ? { ...app, ...updated } : app))
      )
      closeEditModal()
    } catch (err) {
      alert(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">🏆 솔라레 대회 신청 관리</h1>
          <p className="mt-1 text-sm text-gray-400">
            참가 신청서를 검토하고 승인/거절 상태를 관리하세요. 신청자는 팀명 6글자, 3인 팀 구성만 지원합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/Tournament"
            target="_blank"
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
          >
            대회 페이지 보기
          </Link>
          <Link
            href="/Tournament/apply"
            target="_blank"
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-blue-500/40 text-blue-200 hover:bg-blue-500/20 transition-colors"
          >
            신청 폼 열기
          </Link>
        </div>
      </header>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "approved", "waitlist", "rejected"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status === "all" ? "all" : status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                selectedStatus === status
                  ? "bg-blue-500/20 text-blue-200 border-blue-400/60"
                  : "border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              {status === "all" ? "전체" : STATUS_LABELS[status]}
              {status === "all"
                ? ` (${applications.length})`
                : ` (${applications.filter((app) => app.status === status).length})`}
            </button>
          ))}
        </div>
        <div className="w-full max-w-xs">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="팀명, 가문명, 디스코드 검색"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
          />
        </div>
      </section>

      <section className="bg-zinc-900/60 border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-gray-400">불러오는 중...</div>
        ) : error ? (
          <div className="py-20 text-center text-red-400">{error}</div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-20 text-center text-gray-400">조건에 맞는 신청서가 없습니다.</div>
        ) : (
          <div className="grid gap-4">
            {filteredApplications.map((app) => (
              <article
                key={app.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5 space-y-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {app.team_name}
                      <span className="ml-3 text-sm font-medium text-gray-400">
                        #{app.id.toString().padStart(4, "0")}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      대표자: {app.leader_family_name} | 디스코드: {app.leader_discord}
                    </p>
                    <p className="text-xs text-gray-500">
                      접수일: {new Date(app.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[app.status]}`}
                    >
                      {STATUS_LABELS[app.status]}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app.id, e.target.value as ApplicationStatus)}
                      className="rounded-lg border border-white/10 bg-zinc-900/80 px-2 py-1 text-xs text-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    >
                      {(["pending", "approved", "waitlist", "rejected"] as ApplicationStatus[]).map(
                        (status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDelete(app.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-red-300 border border-red-500/40 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      삭제
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(app)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-200 border border-blue-500/40 rounded-lg hover:bg-blue-500/10 transition-colors"
                    >
                      수정
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3 space-y-2">
                    <h4 className="text-sm font-semibold text-white">팀원</h4>
                    <ul className="space-y-1 text-xs text-gray-300">
                      {app.team_members.map((member, idx) => (
                        <li
                          key={`${app.id}-${member.familyName}-${idx}`}
                          className="flex justify-between gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                        >
                          <span className="font-medium text-gray-200">{member.familyName}</span>
                          <span className="text-gray-400">{member.className}</span>
                          <span className="text-gray-500">
                            {member.score ? `${member.score}점` : "-"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3 space-y-2 text-xs text-gray-300">
                    <h4 className="text-sm font-semibold text-white">메모 & 기타</h4>
                    <p className="text-gray-400">
                      규정 동의:{" "}
                      <span className="font-semibold text-gray-200">
                        {app.agree_rules ? "동의" : "미동의"}
                      </span>
                    </p>
                    <p className="break-words whitespace-pre-wrap text-gray-300 min-h-[60px]">
                      {app.notes?.trim() || "메모 없음"}
                    </p>
                    <p className="text-gray-500">
                      수정 비밀번호: <span className="font-mono text-gray-300">{app.edit_password || "-"}</span>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {editingApp && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3">
          <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">신청 수정</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    #{editingApp.id.toString().padStart(4, "0")} · 접수일{" "}
                    {new Date(editingApp.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    팀명 <span className="text-blue-300">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.teamName}
                    onChange={(e) =>
                      setEditForm((prev) =>
                        prev ? { ...prev, teamName: e.target.value.slice(0, 6) } : prev
                      )
                    }
                    maxLength={6}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    대표자 가문명 <span className="text-blue-300">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.leaderFamilyName}
                    onChange={(e) =>
                      setEditForm((prev) =>
                        prev ? { ...prev, leaderFamilyName: e.target.value } : prev
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    대표자 디스코드 ID <span className="text-blue-300">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.leaderDiscord}
                    onChange={(e) =>
                      setEditForm((prev) =>
                        prev ? { ...prev, leaderDiscord: e.target.value } : prev
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    수정 비밀번호 <span className="text-blue-300">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.editPassword}
                    onChange={(e) =>
                      setEditForm((prev) =>
                        prev ? { ...prev, editPassword: e.target.value } : prev
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  메모
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm((prev) => (prev ? { ...prev, notes: e.target.value } : prev))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">팀원 정보</h3>
                <div className="grid gap-3">
                  {editForm.members.map((member, index) => (
                    <div
                      key={index}
                      className="grid gap-3 sm:grid-cols-[1fr_1fr_120px]"
                    >
                      <input
                        type="text"
                        value={member.familyName}
                        onChange={(e) => handleEditMemberChange(index, "familyName", e.target.value)}
                        placeholder="가문명"
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                        required
                      />
                      <input
                        type="text"
                        value={member.className}
                        onChange={(e) => handleEditMemberChange(index, "className", e.target.value)}
                        placeholder="주 클래스"
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                        maxLength={30}
                        required
                      />
                      <input
                        type="number"
                        value={member.score ?? ""}
                        onChange={(e) => handleEditMemberChange(index, "score", e.target.value)}
                        placeholder="점수"
                        className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                        min={0}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-sm font-semibold text-gray-300 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  disabled={saving}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "저장 중..." : "변경 사항 저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

