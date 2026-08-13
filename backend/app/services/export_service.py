"""
Servicio de Exportación a ASCII
Convierte diagramas de flujo a formato ASCII art para compartir en texto plano
"""

import logging
from typing import Dict, List, Any, Set
from collections import defaultdict

logger = logging.getLogger(__name__)


class ExportService:
    SYMBOLS = {
        "start": "●",
        "end": "●",
        "process": "□",
        "decision": "◇",
        "subflow": "▢",
        "horizontal": "─",
        "vertical": "│",
        "arrow": "→",
    }

    CONDITION_STYLES = {
        "yes": "✓",
        "no": "✗",
        "true": "✓",
        "false": "✗",
    }

    @staticmethod
    def export_flow(flow: Dict[str, Any]) -> str:
        try:
            lines = []
            lines.append("┌" + "─" * 70 + "┐")
            lines.append(f"│ FLOW DIAGRAM: {flow.get('name', 'Untitled'):<54} │")
            description = flow.get("description", "")
            if description:
                desc_truncated = description[:66]
                lines.append(f"│ Description: {desc_truncated:<54} │")
            lines.append("└" + "─" * 70 + "┘")
            lines.append("")
            nodes = flow.get("nodes", [])
            edges = flow.get("edges", [])
            if not nodes:
                lines.append("[No nodes defined]")
                return "\n".join(lines)
            connections = ExportService._build_node_tree(nodes, edges)
            rendered = ExportService._render_tree(connections, nodes, edges)
            lines.extend(rendered)
            lines.append("")
            lines.append(f"Total nodes: {len(nodes)}")
            lines.append(f"Total edges: {len(edges)}")
            return "\n".join(lines)
        except Exception as e:
            logger.error(f"Error exporting flow: {str(e)}")
            return f"Export error: {str(e)}"

    @staticmethod
    def _build_node_tree(nodes: List[Dict], edges: List[Dict]) -> Dict[str, List[Dict]]:
        connections = defaultdict(list)
        for edge in edges:
            connections[edge["source"]].append({
                "target": edge["target"],
                "condition": edge.get("data", {}).get("condition", ""),
            })
        return connections

    @staticmethod
    def _render_tree(connections: Dict, nodes: List[Dict], edges: List[Dict], max_depth: int = 50) -> List[str]:
        lines = []
        node_map = {n["id"]: n for n in nodes}
        all_targets = {edge["target"] for edge in edges}
        roots = [n["id"] for n in nodes if n["id"] not in all_targets]
        if not roots:
            roots = [nodes[0]["id"]] if nodes else []
        visited = set()
        for root_id in roots:
            ExportService._render_node(
                node_id=root_id,
                node_map=node_map,
                connections=connections,
                lines=lines,
                prefix="",
                visited=visited,
                depth=0,
                max_depth=max_depth,
            )
        return lines

    @staticmethod
    def _render_node(
        node_id: str,
        node_map: Dict,
        connections: Dict,
        lines: List[str],
        prefix: str = "",
        visited: Set[str] = None,
        depth: int = 0,
        max_depth: int = 50,
    ) -> None:
        if visited is None:
            visited = set()
        if depth > max_depth or node_id in visited:
            return
        visited.add(node_id)
        if node_id not in node_map:
            return
        node = node_map[node_id]
        symbol = ExportService._get_node_symbol(node.get("type", "process"))
        lines.append(f"{prefix}{symbol} {node.get('label', 'Untitled')}")
        children = connections.get(node_id, [])
        for i, child_info in enumerate(children):
            child_id = child_info["target"]
            condition = child_info.get("condition", "")
            is_last = i == len(children) - 1
            connector = "└── " if is_last else "├── "
            child_prefix = prefix + ("    " if is_last else "│   ")
            if condition:
                condition_symbol = ExportService.CONDITION_STYLES.get(condition, "→")
                lines.append(f"{prefix}{connector[:-4]}{condition_symbol}  [{condition}]")
            else:
                lines.append(f"{prefix}{connector[:-4]}{ExportService.SYMBOLS['arrow']}")
            ExportService._render_node(
                node_id=child_id,
                node_map=node_map,
                connections=connections,
                lines=lines,
                prefix=child_prefix,
                visited=visited,
                depth=depth + 1,
                max_depth=max_depth,
            )

    @staticmethod
    def _get_node_symbol(node_type: str) -> str:
        symbols = {
            "start": "●",
            "end": "■",
            "process": "□",
            "decision": "◇",
            "subflow": "▢",
            "input": "⬚",
            "output": "⬛",
        }
        return symbols.get(node_type, "•")

    @staticmethod
    def export_flow_table(flow: Dict[str, Any]) -> str:
        lines = [
            "┌────────┬──────────────┬────────────┬──────────────┐",
            "│ ID     │ Type         │ Label      │ Description  │",
            "├────────┼──────────────┼────────────┼──────────────┤",
        ]
        for node in flow.get("nodes", []):
            node_id = node.get("id", "")[:8]
            node_type = node.get("type", "")
            label = node.get("label", "")[:10]
            desc = node.get("data", {}).get("description", "")[:12]
            lines.append(f"│ {node_id:<6} │ {node_type:<12} │ {label:<10} │ {desc:<12} │")
        lines.append("└────────┴──────────────┴────────────┴──────────────┘")
        return "\n".join(lines)

    @staticmethod
    def export_flow_compact(flow: Dict[str, Any]) -> str:
        nodes = flow.get("nodes", [])
        if not nodes:
            return "[Empty flow]"
        parts = [n.get("label", n.get("type", "node")) for n in nodes]
        return " → ".join(parts)


export_service = ExportService()
